const db = require('../config/database');

// Função para cadastrar um novo item no estoque
const cadastrarItem = async (req, res) => {
  const { 
    nome, descricao, categoria, unidade_medida, 
    quantidade_atual, quantidade_minima 
  } = req.body;

  try {
    const novoItem = await db.query(
      `INSERT INTO itens (
        nome, descricao, categoria, unidade_medida, 
        quantidade_atual, quantidade_minima
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nome, descricao, categoria, unidade_medida, quantidade_atual, quantidade_minima]
    );

    // Registrar movimentação de entrada inicial
    if (quantidade_atual > 0) {
      await db.query(
        `INSERT INTO movimentacoes_estoque (
          id_item, tipo, quantidade, responsavel_id, observacao
        ) VALUES ($1, $2, $3, $4, $5)`,
        [novoItem.rows[0].id, 'entrada', quantidade_atual, req.user.id, 'Cadastro inicial do item']
      );
    }

    res.status(201).json({
      message: 'Item cadastrado com sucesso',
      item: novoItem.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
    res.status(500).json({ message: 'Erro ao cadastrar item' });
  }
};

// Função para listar todos os itens do estoque
const listarItens = async (req, res) => {
  try {
    const itens = await db.query(
      `SELECT * FROM itens 
       WHERE ativo = true 
       ORDER BY categoria, nome`
    );

    res.json(itens.rows);
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    res.status(500).json({ message: 'Erro ao listar itens' });
  }
};

// Função para obter detalhes de um item específico
const getItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await db.query('SELECT * FROM itens WHERE id = $1', [id]);

    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Obter histórico de movimentações
    const movimentacoes = await db.query(
      `SELECT me.id, me.tipo, me.quantidade, me.data_movimentacao, me.observacao,
              u.nome as responsavel_nome
       FROM movimentacoes_estoque me
       JOIN utilizadores u ON me.responsavel_id = u.id
       WHERE me.id_item = $1
       ORDER BY me.data_movimentacao DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      ...item.rows[0],
      movimentacoes: movimentacoes.rows
    });
  } catch (error) {
    console.error('Erro ao obter detalhes do item:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do item' });
  }
};

// Função para atualizar um item
const atualizarItem = async (req, res) => {
  const { id } = req.params;
  const { 
    nome, descricao, categoria, unidade_medida, 
    quantidade_minima, ativo 
  } = req.body;

  try {
    const itemAtualizado = await db.query(
      `UPDATE itens 
       SET nome = COALESCE($1, nome), 
           descricao = COALESCE($2, descricao), 
           categoria = COALESCE($3, categoria),
           unidade_medida = COALESCE($4, unidade_medida),
           quantidade_minima = COALESCE($5, quantidade_minima),
           ativo = COALESCE($6, ativo)
       WHERE id = $7 
       RETURNING *`,
      [nome, descricao, categoria, unidade_medida, quantidade_minima, ativo, id]
    );

    if (itemAtualizado.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.json({
      message: 'Item atualizado com sucesso',
      item: itemAtualizado.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro ao atualizar item' });
  }
};

// Função para registrar entrada de itens no estoque
const registrarEntrada = async (req, res) => {
  const { id_item, quantidade, observacao } = req.body;

  try {
    // Verificar se o item existe
    const item = await db.query('SELECT * FROM itens WHERE id = $1', [id_item]);

    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Iniciar transação
    await db.query('BEGIN');

    // Registrar movimentação
    const movimentacao = await db.query(
      `INSERT INTO movimentacoes_estoque (
        id_item, tipo, quantidade, responsavel_id, observacao
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_item, 'entrada', quantidade, req.user.id, observacao]
    );

    // Atualizar quantidade do item
    const novaQuantidade = parseInt(item.rows[0].quantidade_atual) + parseInt(quantidade);
    
    await db.query(
      'UPDATE itens SET quantidade_atual = $1 WHERE id = $2',
      [novaQuantidade, id_item]
    );

    // Finalizar transação
    await db.query('COMMIT');

    res.status(201).json({
      message: 'Entrada registrada com sucesso',
      movimentacao: movimentacao.rows[0],
      quantidade_atual: novaQuantidade
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao registrar entrada:', error);
    res.status(500).json({ message: 'Erro ao registrar entrada' });
  }
};

// Função para registrar ajuste de estoque
const registrarAjuste = async (req, res) => {
  const { id_item, quantidade_nova, observacao } = req.body;

  try {
    // Verificar se o item existe
    const item = await db.query('SELECT * FROM itens WHERE id = $1', [id_item]);

    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Calcular diferença
    const quantidadeAtual = parseInt(item.rows[0].quantidade_atual);
    const quantidadeNova = parseInt(quantidade_nova);
    const diferenca = quantidadeNova - quantidadeAtual;
    const tipo = diferenca >= 0 ? 'ajuste' : 'ajuste';

    // Iniciar transação
    await db.query('BEGIN');

    // Registrar movimentação
    const movimentacao = await db.query(
      `INSERT INTO movimentacoes_estoque (
        id_item, tipo, quantidade, responsavel_id, observacao
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_item, tipo, Math.abs(diferenca), req.user.id, observacao]
    );

    // Atualizar quantidade do item
    await db.query(
      'UPDATE itens SET quantidade_atual = $1 WHERE id = $2',
      [quantidadeNova, id_item]
    );

    // Finalizar transação
    await db.query('COMMIT');

    res.status(201).json({
      message: 'Ajuste registrado com sucesso',
      movimentacao: movimentacao.rows[0],
      quantidade_atual: quantidadeNova
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao registrar ajuste:', error);
    res.status(500).json({ message: 'Erro ao registrar ajuste' });
  }
};

// Função para listar itens com estoque baixo
const listarEstoqueBaixo = async (req, res) => {
  try {
    const itens = await db.query(
      `SELECT * FROM itens 
       WHERE quantidade_atual <= quantidade_minima AND ativo = true 
       ORDER BY quantidade_atual`
    );

    res.json(itens.rows);
  } catch (error) {
    console.error('Erro ao listar itens com estoque baixo:', error);
    res.status(500).json({ message: 'Erro ao listar itens com estoque baixo' });
  }
};

module.exports = {
  cadastrarItem,
  listarItens,
  getItem,
  atualizarItem,
  registrarEntrada,
  registrarAjuste,
  listarEstoqueBaixo
};
