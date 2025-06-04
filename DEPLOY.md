# 🚀 Guia de Deploy - Agenda Master

Este guia explica como fazer deploy do Agenda Master em diferentes plataformas para disponibilizar publicamente.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no GitHub
- Código commitado no GitHub

## 🌐 Opções de Deploy

### 1. Railway (Recomendado - Mais Simples)

Railway é uma plataforma moderna que facilita muito o deploy de aplicações fullstack.

#### Passos:

1. **Acesse [Railway.app](https://railway.app)**
2. **Faça login com GitHub**
3. **Clique em "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Escolha seu repositório do Agenda Master**
6. **Railway detectará automaticamente que é um projeto Node.js**

#### Configurações necessárias:

1. **Adicione as variáveis de ambiente:**
   ```
   NODE_ENV=production
   PORT=3001
   DATA_DIRECTORY=/app/data
   JWT_SECRET=seu-jwt-secret-muito-seguro-para-producao
   FRONTEND_URL=https://seu-app.railway.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app-do-gmail
   ```

2. **Railway criará automaticamente o domínio público**

#### Vantagens:
- ✅ Deploy automático a cada commit
- ✅ HTTPS automático
- ✅ Domínio personalizado grátis
- ✅ Banco SQLite funciona perfeitamente
- ✅ Logs em tempo real

---

### 2. Render

Render é outra opção excelente e gratuita.

#### Passos:

1. **Acesse [Render.com](https://render.com)**
2. **Conecte com GitHub**
3. **Clique em "New +" → "Web Service"**
4. **Selecione seu repositório**
5. **Configure:**
   - **Build Command:** `npm run build`
   - **Start Command:** `node dist/server/index.js`
   - **Environment:** Node

#### Configurações:
- Adicione as mesmas variáveis de ambiente do Railway
- Render oferece domínio `.onrender.com` gratuito

---

### 3. Heroku (Pago desde 2022)

Se você tem conta paga no Heroku:

#### Passos:

1. **Instale Heroku CLI**
2. **No terminal:**
   ```bash
   heroku create seu-app-name
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=seu-jwt-secret
   # ... outras variáveis
   git push heroku main
   ```

---

### 4. VPS (DigitalOcean, Linode, AWS EC2)

Para quem quer mais controle:

#### Exemplo com DigitalOcean:

1. **Crie um Droplet Ubuntu**
2. **Conecte via SSH**
3. **Instale Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone o projeto:**
   ```bash
   git clone https://github.com/seu-usuario/agenda-master.git
   cd agenda-master
   ```

5. **Configure o projeto:**
   ```bash
   npm install
   npm run build
   
   # Crie arquivo .env
   nano .env
   ```

6. **Use PM2 para gerenciar:**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/server/index.js --name agenda-master
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx:**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/agenda-master
   ```

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

   ```bash
   sudo ln -s /etc/nginx/sites-available/agenda-master /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Configure SSL com Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

---

## 🔧 Preparando o Projeto para Deploy

### 1. Verificar package.json

Certifique-se que o package.json tem:

```json
{
  "scripts": {
    "build": "vite build && tsc --project tsconfig.server.json",
    "start": "node dist/server/index.js"
  }
}
```

### 2. Variáveis de Ambiente Necessárias

```env
NODE_ENV=production
PORT=3001
DATA_DIRECTORY=/app/data
JWT_SECRET=jwt-secret-muito-seguro-128-caracteres-minimo
FRONTEND_URL=https://seu-dominio.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=senha-de-app-do-gmail
```

### 3. Configurar Email (Gmail)

1. **Ative 2FA na conta Google**
2. **Gere senha de app:**
   - Google Account → Security → 2-Step Verification → App passwords
   - Gere uma senha para "Email"
   - Use essa senha no `SMTP_PASS`

---

## 🎯 Deploy Recomendado (Railway)

Para uma demo pública rápida, recomendo **Railway**:

### Passo a passo completo:

1. **Commit seu código no GitHub**
2. **Vá para [Railway.app](https://railway.app)**
3. **Login com GitHub**
4. **"New Project" → "Deploy from GitHub repo"**
5. **Selecione o repositório**
6. **Vá em Settings → Variables:**
   ```
   NODE_ENV=production
   DATA_DIRECTORY=/app/data
   JWT_SECRET=agenda-master-jwt-secret-super-seguro-2024
   FRONTEND_URL=https://agenda-master-production.up.railway.app
   ```
7. **Deploy acontece automaticamente**
8. **Acesse o domínio gerado pelo Railway**

### Resultado:
- ✅ App funcionando em minutos
- ✅ HTTPS automático
- ✅ URL pública para compartilhar
- ✅ Deploy automático a cada push

---

## 📱 Testando o Deploy

Após o deploy, teste:

1. **Registro de usuário**
2. **Login**
3. **Criação de categorias**
4. **Criação de tarefas**
5. **Cronômetro**
6. **Chat AI**
7. **Relatórios**
8. **Tema escuro/claro**

---

## 🔒 Segurança em Produção

1. **Use JWT_SECRET forte:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Configure CORS adequadamente**
3. **Use HTTPS sempre**
4. **Configure rate limiting se necessário**

---

## 📊 Monitoramento

### Railway:
- Logs em tempo real no dashboard
- Métricas de uso
- Alertas automáticos

### VPS:
- Use PM2 para logs: `pm2 logs`
- Configure monitoring com PM2 Plus
- Use ferramentas como New Relic ou DataDog

---

## 🚀 URL de Exemplo

Após deploy no Railway, você terá algo como:
`https://agenda-master-production.up.railway.app`

Use essa URL para:
- ✅ Mostrar para amigos
- ✅ Adicionar ao portfólio
- ✅ Compartilhar no LinkedIn
- ✅ Demonstrações

---

## 💡 Dicas Finais

1. **Teste localmente antes do deploy:**
   ```bash
   npm run build
   NODE_ENV=production node dist/server/index.js
   ```

2. **Use Railway para demos rápidas**
3. **Use VPS para projetos sérios**
4. **Configure monitoramento desde o início**
5. **Mantenha backups do banco SQLite**

**Boa sorte com o deploy! 🎉**