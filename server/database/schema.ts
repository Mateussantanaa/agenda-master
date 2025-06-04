export interface DatabaseSchema {
  users: {
    id: number;
    nome_usuario: string;
    nome: string;
    email: string;
    data_nascimento: string | null;
    senha: string;
    token_recuperacao: string | null;
    token_expira_em: string | null;
    criado_em: string;
  };
  categories: {
    id: number;
    nome: string;
    cor: string;
    usuario_id: number | null;
    criado_em: string;
  };
  tasks: {
    id: number;
    titulo: string;
    descricao: string | null;
    categoria_id: number;
    usuario_id: number | null;
    prioridade: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    data_vencimento: string | null;
    horas_estimadas: number;
    horas_reais: number;
    criado_em: string;
    completado_em: string | null;
  };
  study_sessions: {
    id: number;
    tarefa_id: number;
    duracao_minutos: number;
    duracao_segundos: number;
    observacoes: string | null;
    data_sessao: string;
  };
  achievements: {
    id: number;
    nome: string;
    descricao: string;
    icone: string;
    tipo: 'study_time' | 'tasks_completed' | 'streak' | 'category' | 'special';
    condicao_valor: number;
    condicao_extra: string | null;
    criado_em: string;
  };
  user_achievements: {
    id: number;
    usuario_id: number;
    achievement_id: number;
    desbloqueado_em: string;
  };
}