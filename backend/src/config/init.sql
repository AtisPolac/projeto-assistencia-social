-- Criação das tabelas principais

-- Tabela de Utilizadores
CREATE TABLE utilizadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('admin', 'gerenciador', 'assistido')),
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP,
  token_recuperacao VARCHAR(255)
);

-- Tabela de Grupos
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  capacidade_maxima INTEGER NOT NULL DEFAULT 20,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Gerenciadores de Grupo
CREATE TABLE gerenciadores_grupo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_utilizador UUID NOT NULL REFERENCES utilizadores(id),
  id_grupo UUID NOT NULL REFERENCES grupos(id),
  data_atribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  UNIQUE(id_utilizador, id_grupo)
);

-- Tabela de Vulneráveis
CREATE TABLE vulneraveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  genero VARCHAR(20),
  estado_civil VARCHAR(20),
  endereco VARCHAR(255) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  situacao_emprego VARCHAR(50) NOT NULL,
  renda_familiar DECIMAL(10,2),
  num_dependentes INTEGER DEFAULT 0,
  necessidades_especiais BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'espera' CHECK (status IN ('espera', 'assistido', 'concluido', 'desistente'))
);

-- Tabela de Assistidos
CREATE TABLE assistidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_vulneravel UUID NOT NULL REFERENCES vulneraveis(id),
  id_grupo UUID NOT NULL REFERENCES grupos(id),
  id_gerenciador UUID NOT NULL REFERENCES utilizadores(id),
  data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_fim_prevista TIMESTAMP NOT NULL,
  data_fim_real TIMESTAMP,
  motivo_saida VARCHAR(20) CHECK (motivo_saida IN ('tempo_expirado', 'emprego', 'desistencia', 'outro')),
  detalhes_saida TEXT,
  extensao_concedida BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'))
);

-- Tabela de Itens
CREATE TABLE itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100) NOT NULL,
  unidade_medida VARCHAR(20) NOT NULL,
  quantidade_atual INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER NOT NULL DEFAULT 5,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Movimentações de Estoque
CREATE TABLE movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_item UUID NOT NULL REFERENCES itens(id),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
  quantidade INTEGER NOT NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responsavel_id UUID NOT NULL REFERENCES utilizadores(id),
  observacao TEXT
);

-- Tabela de Doações
CREATE TABLE doacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_assistido UUID NOT NULL REFERENCES assistidos(id),
  id_gerenciador UUID NOT NULL REFERENCES utilizadores(id),
  data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT,
  comprovante_gerado BOOLEAN DEFAULT FALSE
);

-- Tabela de Itens de Doação
CREATE TABLE itens_doacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_doacao UUID NOT NULL REFERENCES doacoes(id),
  id_item UUID NOT NULL REFERENCES itens(id),
  quantidade INTEGER NOT NULL
);

-- Tabela de Comprovantes
CREATE TABLE comprovantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_doacao UUID NOT NULL REFERENCES doacoes(id),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assinado BOOLEAN DEFAULT FALSE,
  url_documento VARCHAR(255)
);

-- Índices para otimização
CREATE INDEX idx_vulneraveis_status ON vulneraveis(status);
CREATE INDEX idx_assistidos_data_fim_prevista ON assistidos(data_fim_prevista);
CREATE INDEX idx_assistidos_id_grupo ON assistidos(id_grupo);
CREATE INDEX idx_itens_quantidade_atual ON itens(quantidade_atual);
CREATE INDEX idx_doacoes_data_doacao ON doacoes(data_doacao);
CREATE INDEX idx_utilizadores_email ON utilizadores(email);

-- Inserir administrador padrão
INSERT INTO utilizadores (nome, email, password, tipo)
VALUES ('Administrador', 'admin@assistenciasocial.org', '$2b$10$X7GQgfYNaRdcvd9Yl2CM8O6YzZqoC3y3WKhiJBKGLnT1h/IDwuDVm', 'admin');

-- Inserir grupos iniciais
INSERT INTO grupos (nome, descricao)
VALUES 
  ('Grupo 1', 'Grupo de assistência para famílias'),
  ('Grupo 2', 'Grupo de assistência para idosos'),
  ('Grupo 3', 'Grupo de assistência para crianças'),
  ('Grupo 4', 'Grupo de assistência para pessoas com deficiência');
