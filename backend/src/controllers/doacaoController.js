const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Função para criar uma nova doação
const criarDoacao = async (req, res) => {
  const { id_assistido, itens, observacao } = req.body;
  const id_gerenciador = req.user.id;

  try {
    // Verificar se o assistido existe e está ativo
    const assistido = await db.query(
      'SELECT a.*, g.id as id_grupo FROM assistidos a JOIN grupos g ON a.id_grupo = g.id WHERE a.id = $1 AND a.status = $2',
      [id_assistido, 'ativo']
    );

    if (assistido.rows.length === 0) {
      return res.status(404).json({ message: 'Assistido não encontrado ou não está ativo' });
    }

    // Verificar se o gerenciador pertence ao grupo do assistido
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [id_gerenciador, assistido.rows[0].id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não é gerenciador do grupo deste assistido' });
      }
    }

    // Verificar se há itens na doação
    if (!itens || itens.length === 0) {
      return res.status(400).json({ message: 'A doação deve conter pelo menos um item' });
    }

    // Iniciar transação
    await db.query('BEGIN');

    // Criar doação
    const novaDoacao = await db.query(
      `INSERT INTO doacoes (id_assistido, id_gerenciador, observacao)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_assistido, id_gerenciador, observacao]
    );

    // Processar cada item da doação
    for (const item of itens) {
      // Verificar se o item existe e tem estoque suficiente
      const itemEstoque = await db.query(
        'SELECT * FROM itens WHERE id = $1 AND ativo = true',
        [item.id_item]
      );

      if (itemEstoque.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ message: `Item ${item.id_item} não encontrado ou não está ativo` });
      }

      if (parseInt(itemEstoque.rows[0].quantidade_atual) < parseInt(item.quantidade)) {
        await db.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Estoque insuficiente para o item ${itemEstoque.rows[0].nome}. Disponível: ${itemEstoque.rows[0].quantidade_atual}` 
        });
      }

      // Adicionar item à doação
      await db.query(
        `INSERT INTO itens_doacao (id_doacao, id_item, quantidade)
         VALUES ($1, $2, $3)`,
        [novaDoacao.rows[0].id, item.id_item, item.quantidade]
      );

      // Registrar saída no estoque
      await db.query(
        `INSERT INTO movimentacoes_estoque (id_item, tipo, quantidade, responsavel_id, observacao)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.id_item, 'saida', item.quantidade, id_gerenciador, `Doação para assistido ID: ${id_assistido}`]
      );

      // Atualizar quantidade do item
      const novaQuantidade = parseInt(itemEstoque.rows[0].quantidade_atual) - parseInt(item.quantidade);
      await db.query(
        'UPDATE itens SET quantidade_atual = $1 WHERE id = $2',
        [novaQuantidade, item.id_item]
      );
    }

    // Gerar código único para o comprovante
    const codigoComprovante = `DOA-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Criar comprovante
    await db.query(
      `INSERT INTO comprovantes (id_doacao, codigo)
       VALUES ($1, $2)`,
      [novaDoacao.rows[0].id, codigoComprovante]
    );

    // Atualizar doação para indicar que o comprovante foi gerado
    await db.query(
      'UPDATE doacoes SET comprovante_gerado = true WHERE id = $1',
      [novaDoacao.rows[0].id]
    );

    // Finalizar transação
    await db.query('COMMIT');

    res.status(201).json({
      message: 'Doação registrada com sucesso',
      doacao: {
        ...novaDoacao.rows[0],
        codigo_comprovante: codigoComprovante
      }
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao registrar doação:', error);
    res.status(500).json({ message: 'Erro ao registrar doação' });
  }
};

// Função para listar doações
const listarDoacoes = async (req, res) => {
  const { id_assistido } = req.query;

  try {
    let query = `
      SELECT d.id, d.data_doacao, d.comprovante_gerado,
             a.id as id_assistido, v.nome_completo as nome_assistido,
             u.nome as nome_gerenciador,
             (SELECT COUNT(*) FROM itens_doacao WHERE id_doacao = d.id) as quantidade_itens
      FROM doacoes d
      JOIN assistidos a ON d.id_assistido = a.id
      JOIN vulneraveis v ON a.id_vulneravel = v.id
      JOIN utilizadores u ON d.id_gerenciador = u.id
    `;

    const params = [];

    if (id_assistido) {
      query += ' WHERE d.id_assistido = $1';
      params.push(id_assistido);
    }

    query += ' ORDER BY d.data_doacao DESC';

    const doacoes = await db.query(query, params);

    res.json(doacoes.rows);
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ message: 'Erro ao listar doações' });
  }
};

// Função para obter detalhes de uma doação
const getDoacao = async (req, res) => {
  const { id } = req.params;

  try {
    // Obter dados da doação
    const doacao = await db.query(
      `SELECT d.*, 
              v.nome_completo as nome_assistido, v.cpf as cpf_assistido,
              u.nome as nome_gerenciador,
              c.codigo as codigo_comprovante, c.data_geracao as data_comprovante
       FROM doacoes d
       JOIN assistidos a ON d.id_assistido = a.id
       JOIN vulneraveis v ON a.id_vulneravel = v.id
       JOIN utilizadores u ON d.id_gerenciador = u.id
       LEFT JOIN comprovantes c ON d.id = c.id_doacao
       WHERE d.id = $1`,
      [id]
    );

    if (doacao.rows.length === 0) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    // Obter itens da doação
    const itens = await db.query(
      `SELECT id.id, id.quantidade, 
              i.nome, i.descricao, i.categoria, i.unidade_medida
       FROM itens_doacao id
       JOIN itens i ON id.id_item = i.id
       WHERE id.id_doacao = $1`,
      [id]
    );

    res.json({
      ...doacao.rows[0],
      itens: itens.rows
    });
  } catch (error) {
    console.error('Erro ao obter detalhes da doação:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes da doação' });
  }
};

// Função para gerar comprovante de doação
const gerarComprovante = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se a doação existe
    const doacao = await db.query(
      `SELECT d.*, 
              v.nome_completo as nome_assistido, v.cpf as cpf_assistido,
              u.nome as nome_gerenciador
       FROM doacoes d
       JOIN assistidos a ON d.id_assistido = a.id
       JOIN vulneraveis v ON a.id_vulneravel = v.id
       JOIN utilizadores u ON d.id_gerenciador = u.id
       WHERE d.id = $1`,
      [id]
    );

    if (doacao.rows.length === 0) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    // Verificar se já existe um comprovante
    const comprovante = await db.query(
      'SELECT * FROM comprovantes WHERE id_doacao = $1',
      [id]
    );

    let codigoComprovante;

    if (comprovante.rows.length === 0) {
      // Gerar código único para o comprovante
      codigoComprovante = `DOA-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Criar comprovante
      await db.query(
        `INSERT INTO comprovantes (id_doacao, codigo)
         VALUES ($1, $2)`,
        [id, codigoComprovante]
      );

      // Atualizar doação para indicar que o comprovante foi gerado
      await db.query(
        'UPDATE doacoes SET comprovante_gerado = true WHERE id = $1',
        [id]
      );
    } else {
      codigoComprovante = comprovante.rows[0].codigo;
    }

    // Obter itens da doação
    const itens = await db.query(
      `SELECT id.quantidade, 
              i.nome, i.descricao, i.categoria, i.unidade_medida
       FROM itens_doacao id
       JOIN itens i ON id.id_item = i.id
       WHERE id.id_doacao = $1`,
      [id]
    );

    // Construir dados do comprovante
    const dadosComprovante = {
      codigo: codigoComprovante,
      data_doacao: doacao.rows[0].data_doacao,
      assistido: {
        nome: doacao.rows[0].nome_assistido,
        cpf: doacao.rows[0].cpf_assistido
      },
      gerenciador: doacao.rows[0].nome_gerenciador,
      itens: itens.rows,
      observacao: doacao.rows[0].observacao
    };

    res.json({
      message: 'Comprovante gerado com sucesso',
      comprovante: dadosComprovante
    });
  } catch (error) {
    console.error('Erro ao gerar comprovante:', error);
    res.status(500).json({ message: 'Erro ao gerar comprovante' });
  }
};

module.exports = {
  criarDoacao,
  listarDoacoes,
  getDoacao,
  gerarComprovante
};
