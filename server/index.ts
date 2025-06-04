import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/connection.js';
import { authenticateToken, generateToken, AuthRequest } from './middleware/auth.js';
import { sendPasswordResetEmail, generateResetToken, testEmailConfig } from './utils/email.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test email configuration on startup
testEmailConfig();

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, name, email, birth_date, password } = req.body;
    console.log('Registering user:', { username, name, email });
    
    // Verificar se usuário já existe
    const existingUser = await db
      .selectFrom('users')
      .select(['id'])
      .where((eb) => eb.or([
        eb('nome_usuario', '=', username),
        eb('email', '=', email)
      ]))
      .executeTakeFirst();
    
    if (existingUser) {
      res.status(400).json({ error: 'Usuário ou email já existe' });
      return;
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const user = await db
      .insertInto('users')
      .values({
        nome_usuario: username,
        nome: name,
        email,
        data_nascimento: birth_date,
        senha: hashedPassword
      })
      .returning(['id', 'nome_usuario', 'nome', 'email'])
      .executeTakeFirstOrThrow();
    
    const token = generateToken({
      id: user.id,
      username: user.nome_usuario,
      name: user.nome,
      email: user.email
    });
    
    console.log('User registered:', user);
    res.status(201).json({ 
      user: {
        id: user.id,
        username: user.nome_usuario,
        name: user.nome,
        email: user.email
      }, 
      token 
    });
    return;
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
    return;
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    
    const user = await db
      .selectFrom('users')
      .select(['id', 'nome_usuario', 'nome', 'email', 'senha'])
      .where('nome_usuario', '=', username)
      .executeTakeFirst();
    
    if (!user) {
      console.log('User not found:', username);
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }
    
    console.log('User found, checking password...');
    const validPassword = await bcrypt.compare(password, user.senha);
    console.log('Password check result:', validPassword);
    
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      res.status(401).json({ error: 'Senha inválida' });
      return;
    }
    
    const userWithoutPassword = {
      id: user.id,
      username: user.nome_usuario,
      name: user.nome,
      email: user.email
    };
    const token = generateToken(userWithoutPassword);
    
    console.log('User logged in successfully:', userWithoutPassword);
    res.json({ user: userWithoutPassword, token });
    return;
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
    return;
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Password reset requested for:', email);
    
    if (!email) {
      res.status(400).json({ error: 'Email é obrigatório' });
      return;
    }
    
    const user = await db
      .selectFrom('users')
      .select(['id', 'email', 'nome'])
      .where('email', '=', email)
      .executeTakeFirst();
    
    if (!user) {
      // Don't reveal if email exists or not for security
      console.log(`Password reset requested for non-existent email: ${email}`);
      res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha' });
      return;
    }
    
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    
    await db
      .updateTable('users')
      .set({
        token_recuperacao: resetToken,
        token_expira_em: expiresAt
      })
      .where('id', '=', user.id)
      .execute();
    
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);
    
    if (emailSent) {
      console.log('Password reset email sent successfully for user:', user.id);
    } else {
      console.log('Failed to send password reset email for user:', user.id);
    }
    
    // Always return success message for security
    res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha' });
    return;
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
    return;
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log('Password reset attempt with token:', token?.substring(0, 8) + '...');
    
    if (!token || !newPassword) {
      res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
      return;
    }
    
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }
    
    const user = await db
      .selectFrom('users')
      .select(['id', 'token_expira_em', 'email'])
      .where('token_recuperacao', '=', token)
      .executeTakeFirst();
    
    if (!user) {
      console.log('Invalid reset token provided');
      res.status(400).json({ error: 'Token inválido ou expirado' });
      return;
    }
    
    if (!user.token_expira_em || new Date(user.token_expira_em) < new Date()) {
      console.log('Expired reset token used for user:', user.id);
      res.status(400).json({ error: 'Token expirado' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db
      .updateTable('users')
      .set({
        senha: hashedPassword,
        token_recuperacao: null,
        token_expira_em: null
      })
      .where('id', '=', user.id)
      .execute();
    
    console.log('Password reset successfully for user:', user.id);
    res.json({ message: 'Senha redefinida com sucesso' });
    return;
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
    return;
  }
});

app.get('/api/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Getting user profile:', req.user?.id);
    res.json({ user: req.user });
    return;
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Erro ao obter perfil' });
    return;
  }
});

// Categories routes
app.get('/api/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Fetching categories for user:', req.user?.id);
    const categories = await db
      .selectFrom('categories')
      .select(['id', 'nome as name', 'cor as color', 'usuario_id as user_id', 'criado_em as created_at'])
      .where('usuario_id', '=', req.user!.id)
      .execute();
    console.log('Categories fetched:', categories.length);
    res.json(categories);
    return;
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
    return;
  }
});

app.post('/api/categories', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body;
    console.log('Creating category:', { name, color, user_id: req.user?.id });
    
    const result = await db
      .insertInto('categories')
      .values({ nome: name, cor: color, usuario_id: req.user!.id })
      .returning(['id', 'nome as name', 'cor as color', 'usuario_id as user_id', 'criado_em as created_at'])
      .executeTakeFirstOrThrow();
    
    console.log('Category created:', result);
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
    return;
  }
});

// Tasks routes
app.get('/api/tasks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Fetching tasks for user:', req.user?.id);
    const tasks = await db
      .selectFrom('tasks')
      .leftJoin('categories', 'tasks.categoria_id', 'categories.id')
      .select([
        'tasks.id',
        'tasks.titulo as title',
        'tasks.descricao as description',
        'tasks.categoria_id as category_id',
        'tasks.usuario_id as user_id',
        'tasks.prioridade as priority',
        'tasks.status',
        'tasks.data_vencimento as due_date',
        'tasks.horas_estimadas as estimated_hours',
        'tasks.horas_reais as actual_hours',
        'tasks.criado_em as created_at',
        'tasks.completado_em as completed_at',
        'categories.nome as category_name',
        'categories.cor as category_color'
      ])
      .where('tasks.usuario_id', '=', req.user!.id)
      .orderBy('tasks.criado_em', 'desc')
      .execute();
    
    console.log('Tasks fetched:', tasks.length);
    res.json(tasks);
    return;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
    return;
  }
});

app.post('/api/tasks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, category_id, priority, due_date, estimated_hours } = req.body;
    console.log('Creating task:', { title, category_id, priority, due_date, user_id: req.user?.id });
    
    const result = await db
      .insertInto('tasks')
      .values({
        titulo: title,
        descricao: description,
        categoria_id: category_id,
        usuario_id: req.user!.id,
        prioridade: priority || 'medium',
        data_vencimento: due_date,
        horas_estimadas: estimated_hours || 1
      })
      .returning([
        'id', 'titulo as title', 'descricao as description', 'categoria_id as category_id', 
        'usuario_id as user_id', 'prioridade as priority', 'status', 'data_vencimento as due_date', 
        'horas_estimadas as estimated_hours', 'horas_reais as actual_hours', 'criado_em as created_at'
      ])
      .executeTakeFirstOrThrow();
    
    console.log('Task created:', result);
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
    return;
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const updateFields = req.body;
    console.log('Updating task:', taskId, updateFields, 'user:', req.user?.id);
    
    const updateData: any = {};
    
    // Handle all possible update fields
    if (updateFields.title !== undefined) updateData.titulo = updateFields.title;
    if (updateFields.description !== undefined) updateData.descricao = updateFields.description;
    if (updateFields.category_id !== undefined) updateData.categoria_id = updateFields.category_id;
    if (updateFields.priority !== undefined) updateData.prioridade = updateFields.priority;
    if (updateFields.status !== undefined) updateData.status = updateFields.status;
    if (updateFields.due_date !== undefined) updateData.data_vencimento = updateFields.due_date;
    if (updateFields.estimated_hours !== undefined) updateData.horas_estimadas = updateFields.estimated_hours;
    if (updateFields.actual_hours !== undefined) updateData.horas_reais = updateFields.actual_hours;
    
    // Set completed_at when status changes to completed
    if (updateFields.status === 'completed') updateData.completado_em = new Date().toISOString();
    
    const result = await db
      .updateTable('tasks')
      .set(updateData)
      .where('id', '=', taskId)
      .where('usuario_id', '=', req.user!.id)
      .returning([
        'id', 'titulo as title', 'descricao as description', 'categoria_id as category_id', 
        'usuario_id as user_id', 'prioridade as priority', 'status', 'data_vencimento as due_date', 
        'horas_estimadas as estimated_hours', 'horas_reais as actual_hours', 'criado_em as created_at', 
        'completado_em as completed_at'
      ])
      .executeTakeFirstOrThrow();
    
    console.log('Task updated:', result);
    res.json(result);
    return;
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
    return;
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const taskId = parseInt(req.params.id);
    console.log('Deleting task:', taskId, 'user:', req.user?.id);
    
    await db
      .deleteFrom('tasks')
      .where('id', '=', taskId)
      .where('usuario_id', '=', req.user!.id)
      .execute();
    
    console.log('Task deleted:', taskId);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
    return;
  }
});

// Study sessions routes
app.post('/api/study-sessions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { task_id, duration_minutes, duration_seconds, notes } = req.body;
    console.log('Creating study session:', { task_id, duration_minutes, duration_seconds, user_id: req.user?.id });
    
    // Verificar se a task pertence ao usuário
    const task = await db
      .selectFrom('tasks')
      .select(['id', 'horas_reais as actual_hours'])
      .where('id', '=', task_id)
      .where('usuario_id', '=', req.user!.id)
      .executeTakeFirst();
    
    if (!task) {
      res.status(404).json({ error: 'Task não encontrada' });
      return;
    }
    
    // Create study session
    const result = await db
      .insertInto('study_sessions')
      .values({
        tarefa_id: task_id,
        duracao_minutos: duration_minutes || 0,
        duracao_segundos: duration_seconds || 0,
        observacoes: notes
      })
      .returning(['id', 'tarefa_id as task_id', 'duracao_minutos as duration_minutes', 'duracao_segundos as duration_seconds', 'observacoes as notes', 'data_sessao as session_date'])
      .executeTakeFirstOrThrow();
    
    // Update task actual hours using precise calculation
    const hoursToAdd = duration_seconds ? duration_seconds / 3600 : duration_minutes / 60;
    const newActualHours = task.actual_hours + Math.round(hoursToAdd * 1000) / 1000; // 3 casas decimais
    
    await db
      .updateTable('tasks')
      .set({ horas_reais: newActualHours })
      .where('id', '=', task_id)
      .execute();
    
    console.log('Study session created:', result);
    console.log('Task actual hours updated to:', newActualHours);
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error('Error creating study session:', error);
    res.status(500).json({ error: 'Failed to create study session' });
    return;
  }
});

app.get('/api/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Fetching stats for user:', req.user?.id);
    
    // Get total tasks count
    const totalTasksResult = await db
      .selectFrom('tasks')
      .select(db.fn.count('id').as('count'))
      .where('usuario_id', '=', req.user!.id)
      .executeTakeFirstOrThrow();
    
    // Get completed tasks count
    const completedTasksResult = await db
      .selectFrom('tasks')
      .select(db.fn.count('id').as('count'))
      .where('status', '=', 'completed')
      .where('usuario_id', '=', req.user!.id)
      .executeTakeFirstOrThrow();
    
    // Get total study time in seconds from study sessions
    const totalTimeResult = await db
      .selectFrom('study_sessions')
      .innerJoin('tasks', 'study_sessions.tarefa_id', 'tasks.id')
      .select(db.fn.sum('duracao_segundos').as('total_seconds'))
      .where('tasks.usuario_id', '=', req.user!.id)
      .executeTakeFirstOrThrow();
    
    // Get sessions count
    const sessionsResult = await db
      .selectFrom('study_sessions')
      .innerJoin('tasks', 'study_sessions.tarefa_id', 'tasks.id')
      .select(db.fn.count('study_sessions.id').as('count'))
      .where('tasks.usuario_id', '=', req.user!.id)
      .executeTakeFirstOrThrow();
    
    const totalSeconds = Number(totalTimeResult.total_seconds) || 0;
    const totalHours = totalSeconds / 3600;
    
    const stats = {
      totalTasks: Number(totalTasksResult.count),
      completedTasks: Number(completedTasksResult.count),
      totalHours: Math.round(totalHours * 100) / 100, // 2 casas decimais
      sessionsCount: Number(sessionsResult.count)
    };
    
    console.log('Stats fetched:', stats);
    res.json(stats);
    return;
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
    return;
  }
});

// Achievements routes
app.get('/api/achievements', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Fetching achievements for user:', req.user?.id);
    
    // Get all achievements with user unlock status
    const achievements = await db
      .selectFrom('achievements')
      .leftJoin('user_achievements', (join) =>
        join
          .onRef('achievements.id', '=', 'user_achievements.achievement_id')
          .on('user_achievements.usuario_id', '=', req.user!.id)
      )
      .select([
        'achievements.id',
        'achievements.nome',
        'achievements.descricao',
        'achievements.icone',
        'achievements.tipo',
        'achievements.condicao_valor',
        'achievements.condicao_extra',
        'achievements.criado_em',
        'user_achievements.desbloqueado_em'
      ])
      .execute();
    
    console.log('Achievements fetched:', achievements.length);
    res.json(achievements);
    return;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
    return;
  }
});

// Test email endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      const testToken = 'test-token-123';
      
      const result = await sendPasswordResetEmail(email || 'test@example.com', testToken);
      
      res.json({ 
        success: result,
        message: result ? 'Test email sent successfully' : 'Failed to send test email'
      });
      return;
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({ error: 'Failed to send test email' });
      return;
    }
  });
}

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
      console.log('Email configuration status:');
      console.log('- SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
      console.log('- SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
      console.log('- SMTP_USER:', process.env.SMTP_USER ? '✓ configured' : '✗ not configured');
      console.log('- SMTP_PASS:', process.env.SMTP_PASS ? '✓ configured' : '✗ not configured');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}