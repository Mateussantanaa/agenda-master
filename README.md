# 📚 Agenda Master

Sistema completo de gerenciamento de tarefas e estudos desenvolvido com React, TypeScript, Node.js e SQLite.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** - Login, registro e recuperação de senha
- 📋 **Gerenciamento de tarefas** - Criar, editar, excluir e organizar tarefas
- 🏷️ **Categorias personalizadas** - Organize suas tarefas por áreas de estudo
- ⏱️ **Cronômetro de estudos** - Acompanhe o tempo dedicado a cada tarefa com precisão de segundos
- 📊 **Dashboard com estatísticas** - Visualize seu progresso
- 🎯 **Sistema de prioridades** - Organize tarefas por importância
- 📅 **Datas de vencimento** - Nunca perca um prazo
- 🔍 **Filtros avançados** - Encontre rapidamente o que procura
- 📧 **Recuperação de senha via email** - Sistema completo de reset
- 🌙 **Tema escuro/claro** - Alternância entre temas com um clique
- 🤖 **Chat com IA** - Assistente inteligente para dúvidas de programação
- 📄 **Relatórios em PDF** - Gere relatórios detalhados sobre seu progresso
- 🏆 **Sistema de conquistas** - Desbloqueie conquistas baseadas no seu desempenho
- 📅 **Calendário visual** - Visualize suas tarefas organizadas por data

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **jsPDF** - Geração de relatórios em PDF

### Backend
- **Node.js** - Runtime
- **Express 5** - Framework web
- **TypeScript** - Tipagem estática
- **SQLite** - Banco de dados
- **Kysely** - Query builder
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **nodemailer** - Envio de emails

## 📋 Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** ou **yarn**
- **Git**

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/agenda-master.git
cd agenda-master
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATA_DIRECTORY=./data

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Secret (mude para uma string segura em produção)
JWT_SECRET=seu-jwt-secret-super-seguro-aqui

# Email Configuration (opcional, mas recomendado para recuperação de senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app-do-gmail
```

### 4. Configure o email (opcional)

Para funcionalidade completa de recuperação de senha, configure o SMTP:

#### Para Gmail:
1. Ative a autenticação de 2 fatores na sua conta Google
2. Gere uma "Senha de app" específica:
   - Acesse: Conta Google → Segurança → Autenticação de dois fatores → Senhas de app
   - Gere uma senha para "Email"
3. Use essa senha no `SMTP_PASS`

#### Para outros provedores:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`

### 5. Crie a estrutura de diretórios

```bash
mkdir -p data
```

## 🏃‍♂️ Executando o Projeto

### Ambiente de Desenvolvimento

```bash
npm run start
```

Isso iniciará:
- **Frontend** em `http://localhost:3000`
- **Backend** em `http://localhost:3001`

### Build para Produção

```bash
npm run build
```

### Executando em Produção

Após fazer o build:

```bash
cd dist
node server/index.js
```

## 🎨 Funcionalidades Detalhadas

### 📊 Dashboard
- Estatísticas de progresso em tempo real
- Gráficos de produtividade semanal
- Lista de tarefas recentes
- Métricas de tempo estudado

### 📋 Gerenciamento de Tarefas
- Criação e edição de tarefas
- Sistema de prioridades (Alta, Média, Baixa)
- Status (Pendente, Em Progresso, Concluído)
- Datas de vencimento com alertas visuais
- Estimativa e controle de horas

### ⏱️ Cronômetro Inteligente
- Cronômetro preciso em horas:minutos:segundos
- Pausa e retomada de sessões
- Salvamento automático do progresso
- Anotações de sessão de estudo

### 🎨 Temas Personalizáveis
- Tema claro e escuro
- Alternância com um clique
- Persistência da preferência do usuário
- Design responsivo em ambos os temas

### 🤖 Assistente de IA
- Chat especializado em programação
- Respostas detalhadas com exemplos de código
- Sugestões de perguntas
- Tópicos populares organizados
- Widget flutuante para acesso rápido

### 📄 Relatórios Avançados
- Geração de relatórios em PDF
- Filtros por categoria, período e tipo
- Estatísticas detalhadas de progresso
- Análise de produtividade por categoria
- Export automático com nome personalizado

### 🏆 Sistema de Conquistas
- Conquistas baseadas em tempo de estudo
- Metas por tarefas concluídas
- Conquistas especiais por categoria
- Sistema de progresso visual
- Motivação gamificada para estudos

### 📅 Calendário Visual
- Visualização mensal de tarefas
- Cores por categoria
- Indicadores de status
- Alertas para tarefas atrasadas
- Navegação intuitiva entre meses

## 🌐 Deploy

### Preparação para Deploy

1. **Configure as variáveis de ambiente de produção**:
   ```env
   NODE_ENV=production
   PORT=3001
   DATA_DIRECTORY=/caminho/absoluto/para/dados
   JWT_SECRET=seu-jwt-secret-muito-seguro-para-producao
   FRONTEND_URL=https://seu-dominio.com
   # ... outras configurações
   ```

2. **Faça o build**:
   ```bash
   npm run build
   ```

3. **Prepare os arquivos**:
   ```bash
   # Copie os arquivos necessários para o servidor
   - dist/ (pasta completa)
   - package.json
   - package-lock.json
   ```

### Deploy em Servidor (Ubuntu/Debian)

1. **Instale o Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Configure o projeto**:
   ```bash
   # No servidor
   mkdir -p /var/www/agenda-master
   cd /var/www/agenda-master
   
   # Copie dist/, package.json, package-lock.json
   
   # Instale dependências de produção
   npm ci --omit=dev
   
   # Crie diretório de dados
   mkdir -p /var/www/agenda-master-data
   ```

3. **Configure variáveis de ambiente**:
   ```bash
   nano .env
   ```

4. **Use PM2 para gerenciar o processo**:
   ```bash
   sudo npm install -g pm2
   
   # Configure PM2
   pm2 start dist/server/index.js --name agenda-master
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx como proxy reverso**:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📁 Estrutura do Projeto

```
agenda-master/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos React (Auth, Theme)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── auth/       # Páginas de autenticação
│   │   │   ├── chat/       # Página do chat AI
│   │   │   ├── dashboard/  # Dashboard e estatísticas
│   │   │   ├── tasks/      # Gerenciamento de tarefas
│   │   │   ├── categories/ # Gerenciamento de categorias
│   │   │   ├── calendar/   # Calendário visual
│   │   │   ├── reports/    # Relatórios em PDF
│   │   │   └── achievements/ # Sistema de conquistas
│   │   └── lib/            # Utilitários
│   └── index.html
├── server/                 # Backend Node.js
│   ├── database/           # Configuração do banco
│   ├── middleware/         # Middlewares Express
│   ├── utils/              # Utilitários
│   └── index.ts           # Servidor principal
├── scripts/               # Scripts de desenvolvimento
├── data/                  # Banco de dados SQLite
├── dist/                  # Build de produção
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run start` - Inicia o ambiente de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run dev` - Alias para start

## 📊 Banco de Dados

O sistema usa SQLite com as seguintes tabelas:

- **users** - Usuários do sistema
- **categories** - Categorias de tarefas
- **tasks** - Tarefas dos usuários
- **study_sessions** - Sessões de estudo com duração em segundos
- **achievements** - Conquistas disponíveis
- **user_achievements** - Conquistas desbloqueadas pelos usuários

O banco é criado automaticamente na primeira execução.

## 🔒 Segurança

- Senhas são hash com bcrypt
- Autenticação via JWT
- Tokens de recuperação com expiração
- Validação de dados no frontend e backend
- Headers de segurança configurados
- Proteção contra ataques comuns (CSRF, XSS)

## 🎨 Acessibilidade

- Suporte completo a temas claro e escuro
- Design responsivo para todos os dispositivos
- Navegação por teclado
- Contrastes adequados
- Componentes semânticos

## 🤖 Chat com IA

O assistente de IA oferece:

- **Linguagens suportadas**: JavaScript, Python, CSS, HTML
- **Frameworks**: React, Node.js, Express
- **Conceitos**: Algoritmos, Big O, Clean Code
- **Ferramentas**: Git, debugging, APIs REST
- **Exemplos práticos** com código funcional
- **Explicações detalhadas** passo a passo

### Exemplos de perguntas:
- "Como funciona o useState no React?"
- "Qual a diferença entre let, const e var?"
- "Como fazer uma API REST com Node.js?"
- "O que é Big O notation?"
- "Como usar async/await em JavaScript?"

## 🏆 Sistema de Conquistas

### Tipos de Conquistas:
- **Tempo de Estudo**: 5h, 25h, 100h estudadas
- **Tarefas Concluídas**: 1, 10, 50, 100 tarefas
- **Categorias**: Organização e especialização
- **Especiais**: Conquistas únicas baseadas em comportamento

### Exemplos:
- 🎯 **Primeiro Passo** - Complete sua primeira tarefa
- ⏱️ **Dedicado** - Estude por 5 horas no total
- 🏃‍♂️ **Maratonista** - Estude por 25 horas no total
- 💛 **Focado em JavaScript** - Complete 10 tarefas de JavaScript

## 📄 Relatórios em PDF

### Tipos de Relatórios:
- **Geral**: Visão completa do progresso
- **Por Categoria**: Análise detalhada por área
- **Por Período**: Filtro temporal personalizado
- **Produtividade**: Métricas de eficiência

### Conteúdo dos Relatórios:
- Estatísticas resumidas
- Análise por categoria
- Lista de tarefas concluídas
- Gráficos de progresso
- Métricas de tempo

## 🐛 Solução de Problemas

### Erro de conexão com banco
```bash
# Verifique se o diretório data existe
mkdir -p data

# Verifique permissões
chmod 755 data
```

### Erro de email
```bash
# Teste a configuração de email
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@teste.com"}'
```

### Porta em uso
```bash
# Mate processos na porta
sudo lsof -ti:3001 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
```

### Tema não funcionando
```bash
# Limpe o localStorage e recarregue
localStorage.removeItem('theme');
window.location.reload();
```

### Erro de geração de PDF
```bash
# Verifique se o jsPDF está instalado
npm list jspdf
npm install jspdf html2canvas
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🚀 Funcionalidades Implementadas ✅

- [x] Relatórios avançados em PDF
- [x] Sistema de conquistas/gamificação  
- [x] Integração com calendário
- [x] Chat com IA avançado
- [x] Tema escuro/claro
- [x] Cronômetro preciso de estudos
- [x] Sistema de autenticação completo

## 🚀 Próximas Funcionalidades

- [ ] Notificações push
- [ ] Modo offline
- [ ] API para mobile
- [ ] Integração com GitHub
- [ ] Colaboração em tempo real
- [ ] Backup automático na nuvem
- [ ] Integração com Google Calendar
- [ ] Análise de produtividade com IA
- [ ] Sistema de metas personalizadas
- [ ] Exportação para outros formatos

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção de [Solução de Problemas](#-solução-de-problemas)
2. Abra uma [issue](https://github.com/seu-usuario/agenda-master/issues)
3. Consulte a documentação das tecnologias utilizadas
4. Use o chat de IA integrado para dúvidas de programação

---

**Desenvolvido com ❤️ para organizar seus estudos de programação!**

*Transforme seus estudos em uma jornada organizada, gamificada e produtiva com o poder da tecnologia moderna e