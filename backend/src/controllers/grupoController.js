const db = require('../config/database');

// Função para criar um novo grupo
const criarGrupo = async (req, res) => {
  const { nome, descricao, capacidade_maxima } = req.body;

  try {
    const novoGrupo = await db.query(
      'INSERT INTO grupos (nome, descricao, capacidade_maxima) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, capacidade_maxima]
    );

    res.status(201).json({
      message: 'Grupo criado com sucesso',
      grupo: novoGrupo.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    res.status(500).json({ message: 'Erro ao criar grupo' });
  }
};

// Função para listar todos os grupos
const listarGrupos = async (req, res) => {
  try {
    const grupos = await db.query('SELECT * FROM grupos ORDER BY nome');
    res.json(grupos.rows);
  } catch (error) {
    console.error('Erro ao listar grupos:', error);
    res.status(500).json({ message: 'Erro ao listar grupos' });
  }
};

// Função para obter detalhes de um grupo específico
const getGrupo = async (req, res) => {
  const { id } = req.params;

  try {
    const grupo = await db.query('SELECT * FROM grupos WHERE id = $1', [id]);

    if (grupo.rows.length === 0) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    // Obter gerenciadores do grupo
    const gerenciadores = await db.query(
      `SELECT u.id, u.nome, u.email, gg.data_atribuicao 
       FROM gerenciadores_grupo gg
       JOIN utilizadores u ON gg.id_utilizador = u.id
       WHERE gg.id_grupo = $1 AND gg.ativo = true`,
      [id]
    );

    // Obter contagem de assistidos ativos no grupo
    const assistidosCount = await db.query(
      'SELECT COUNT(*) FROM assistidos WHERE id_grupo = $1 AND status = $2',
      [id, 'ativo']
    );

    res.json({
      ...grupo.rows[0],
      gerenciadores: gerenciadores.rows,
      assistidos_ativos: parseInt(assistidosCount.rows[0].count)
    });
  } catch (error) {
    console.error('Erro ao obter detalhes do grupo:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do grupo' });
  }
};

// Função para atualizar um grupo
const atualizarGrupo = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, capacidade_maxima, ativo } = req.body;

  try {
    const grupoAtualizado = await db.query(
      `UPDATE grupos 
       SET nome = COALESCE($1, nome), 
           descricao = COALESCE($2, descricao), 
           capacidade_maxima = COALESCE($3, capacidade_maxima),
           ativo = COALESCE($4, ativo)
       WHERE id = $5 
       RETURNING *`,
      [nome, descricao, capacidade_maxima, ativo, id]
    );

    if (grupoAtualizado.rows.length === 0) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    res.json({
      message: 'Grupo atualizado com sucesso',
      grupo: grupoAtualizado.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    res.status(500).json({ message: 'Erro ao atualizar grupo' });
  }
};

// Função para atribuir gerenciador a um grupo
const atribuirGerenciador = async (req, res) => {
  const { id_grupo, id_utilizador } = req.body;

  try {
    // Verificar se o utilizador existe e é do tipo gerenciador
    const utilizador = await db.query(
      'SELECT * FROM utilizadores WHERE id = $1 AND tipo = $2',
      [id_utilizador, 'gerenciador']
    );

    if (utilizador.rows.length === 0) {
      return res.status(400).json({ message: 'Utilizador não encontrado ou não é gerenciador' });
    }

    // Verificar se o grupo existe
    const grupo = await db.query('SELECT * FROM grupos WHERE id = $1', [id_grupo]);

    if (grupo.rows.length === 0) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }

    // Verificar se já existe uma atribuição ativa
    const atribuicaoExistente = await db.query(
      'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
      [id_utilizador, id_grupo]
    );

    if (atribuicaoExistente.rows.length > 0) {
      return res.status(400).json({ message: 'Gerenciador já está atribuído a este grupo' });
    }

    // Criar nova atribuição
    const novaAtribuicao = await db.query(
      'INSERT INTO gerenciadores_grupo (id_utilizador, id_grupo) VALUES ($1, $2) RETURNING *',
      [id_utilizador, id_grupo]
    );

    res.status(201).json({
      message: 'Gerenciador atribuído ao grupo com sucesso',
      atribuicao: novaAtribuicao.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atribuir gerenciador ao grupo:', error);
    res.status(500).json({ message: 'Erro ao atribuir gerenciador ao grupo' });
  }
};

// Função para remover gerenciador de um grupo
const removerGerenciador = async (req, res) => {
  const { id_grupo, id_utilizador } = req.params;

  try {
    // Verificar se existe a atribuição
    const atribuicao = await db.query(
      'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
      [id_utilizador, id_grupo]
    );

    if (atribuicao.rows.length === 0) {
      return res.status(404).json({ message: 'Atribuição não encontrada' });
    }

    // Desativar a atribuição
    await db.query(
      'UPDATE gerenciadores_grupo SET ativo = false WHERE id_utilizador = $1 AND id_grupo = $2',
      [id_utilizador, id_grupo]
    );

    res.json({ message: 'Gerenciador removido do grupo com sucesso' });
  } catch (error) {
    console.error('Erro ao remover gerenciador do grupo:', error);
    res.status(500).json({ message: 'Erro ao remover gerenciador do grupo' });
  }
};

module.exports = {
  criarGrupo,
  listarGrupos,
  getGrupo,
  atualizarGrupo,
  atribuirGerenciador,
  removerGerenciador
};
