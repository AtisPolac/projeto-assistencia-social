# Requisitos do Projeto de Gerenciamento de Assistência Social

## Visão Geral
Este documento detalha os requisitos para a plataforma de gerenciamento de assistência social, que será desenvolvida utilizando Angular para o frontend, Node.js para o backend e PostgreSQL como banco de dados. A plataforma será hospedada no Railway.

## Perfis de Utilizadores
1. **Administrador do Sistema**
   - Acesso total à plataforma
   - Gestão de utilizadores e grupos
   - Visualização de relatórios gerais

2. **Gerenciador de Grupo**
   - Gestão dos assistidos do seu grupo
   - Atribuição de itens do estoque aos assistidos
   - Geração de comprovantes de doação
   - Monitorização do tempo de permanência dos assistidos

3. **Assistido**
   - Visualização do seu próprio perfil e histórico de doações
   - Atualização de informações pessoais

4. **Utilizador não autenticado**
   - Registo como vulnerável (entrada na fila de espera)

## Funcionalidades Principais

### Gestão de Utilizadores e Autenticação
- Registo de novos utilizadores
- Autenticação segura
- Recuperação de palavra-passe
- Atribuição de perfis (Administrador, Gerenciador de Grupo)

### Gestão de Grupos
- Criação e gestão de 4 grupos distintos
- Atribuição de gerenciadores a cada grupo
- Visualização de estatísticas por grupo

### Gestão de Assistidos
- Cadastro completo de vulneráveis (dados pessoais, situação socioeconómica)
- Fila de espera para vulneráveis cadastrados
- "Apadrinhamento" de vulneráveis pelos gerenciadores de grupo
- Monitorização do tempo de permanência (3 meses, extensível por mais 1 mês)
- Gestão de saída do programa (por término do prazo ou por obtenção de emprego)

### Gestão de Estoque
- Cadastro de itens disponíveis para doação
- Controlo de quantidade em estoque
- Histórico de entradas de itens

### Gestão de Doações
- Atribuição de itens do estoque aos assistidos
- Geração de comprovantes de doação
- Histórico de doações por assistido
- Relatórios de doações por período/grupo

## Regras de Negócio

### Tempo de Permanência
- Cada assistido pode permanecer no programa por até 3 meses
- Extensão de até 1 mês adicional em casos especiais
- Após o período máximo, o assistido é retirado e abre vaga para outro vulnerável

### Fila de Espera
- Vulneráveis cadastrados entram automaticamente na fila de espera
- Gerenciadores de grupo podem visualizar a fila e "apadrinhar" vulneráveis
- Ao ser apadrinhado, o vulnerável torna-se assistido daquele grupo

### Doações
- Apenas gerenciadores de grupo podem atribuir doações aos assistidos
- Cada doação deve gerar um comprovante detalhado
- Itens doados são automaticamente deduzidos do estoque

## Requisitos Técnicos

### Frontend (Angular)
- Interface responsiva e intuitiva
- Autenticação JWT
- Formulários validados
- Dashboard com estatísticas
- Relatórios exportáveis

### Backend (Node.js)
- API RESTful
- Autenticação e autorização
- Validação de dados
- Logs de atividades
- Gestão de sessões

### Banco de Dados (PostgreSQL)
- Modelo relacional
- Backup automático
- Índices otimizados
- Integridade referencial

### Hospedagem (Railway)
- Configuração para deploy contínuo
- Variáveis de ambiente seguras
- Monitorização de performance
