# Instruções de Deploy - Sistema de Gerenciamento de Assistência Social

Este documento contém as instruções necessárias para realizar o deploy do sistema de gerenciamento de assistência social no Railway.

## Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Git instalado na máquina local
- Node.js e npm instalados na máquina local

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

1. **Frontend (Angular)**: Interface de utilizador
2. **Backend (Node.js)**: API RESTful e lógica de negócio

## Deploy do Backend

### 1. Configuração do Banco de Dados PostgreSQL no Railway

1. Aceda ao dashboard do Railway
2. Clique em "New Project" > "Database" > "PostgreSQL"
3. Aguarde a criação do banco de dados
4. Aceda às informações de conexão (Variables)
5. Anote as credenciais de conexão:
   - `PGHOST`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `PGPORT`

### 2. Deploy da API Node.js no Railway

1. Aceda ao dashboard do Railway
2. Clique em "New Project" > "Deploy from GitHub"
3. Selecione o repositório do projeto
4. Configure as variáveis de ambiente:
   - `DB_HOST` = valor de `PGHOST`
   - `DB_USER` = valor de `PGUSER`
   - `DB_PASSWORD` = valor de `PGPASSWORD`
   - `DB_NAME` = valor de `PGDATABASE`
   - `DB_PORT` = valor de `PGPORT`
   - `JWT_SECRET` = uma string aleatória segura
   - `PORT` = 3000
5. Configure o comando de inicialização:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && node src/server.js`
6. Aguarde o deploy ser concluído
7. Anote a URL gerada para a API

### 3. Inicialização do Banco de Dados

1. Aceda ao painel do PostgreSQL no Railway
2. Vá para a aba "Data"
3. Execute o script SQL contido em `backend/src/config/init.sql`

## Deploy do Frontend

### 1. Configuração do Frontend

1. Edite o arquivo `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-api-url-do-railway.app/api'
};
```

2. Compile o projeto Angular para produção:
```bash
cd frontend
npm install
ng build --prod
```

### 2. Deploy do Frontend no Railway

1. Aceda ao dashboard do Railway
2. Clique em "New Project" > "Deploy from GitHub"
3. Selecione o repositório do projeto
4. Configure as variáveis de ambiente:
   - `NODE_ENV` = production
5. Configure o comando de inicialização:
   - Build command: `cd frontend && npm install && ng build --prod`
   - Start command: `cd frontend && npx serve -s dist/frontend`
6. Aguarde o deploy ser concluído
7. Anote a URL gerada para o frontend

## Configuração de Domínio Personalizado (Opcional)

1. Aceda às configurações do projeto no Railway
2. Vá para a aba "Settings" > "Domains"
3. Adicione o seu domínio personalizado
4. Siga as instruções para configurar os registos DNS

## Verificação Pós-Deploy

1. Aceda à URL do frontend
2. Faça login com as credenciais de administrador:
   - Email: admin@assistenciasocial.org
   - Senha: admin123
3. Verifique se todas as funcionalidades estão a funcionar corretamente

## Manutenção e Monitorização

- Verifique regularmente os logs da aplicação no Railway
- Configure alertas para monitorizar o desempenho e disponibilidade
- Realize backups periódicos do banco de dados

## Suporte

Em caso de problemas ou dúvidas, entre em contacto com a equipa de desenvolvimento.
