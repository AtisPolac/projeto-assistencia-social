const db = require('../config/database');

// Função para cadastrar um novo vulnerável
const cadastrarVulneravel = async (req, res) => {
  const { 
    nome_completo, cpf, data_nascimento, genero, estado_civil,
    endereco, bairro, cidade, estado, cep, telefone, email,
    situacao_emprego, renda_familiar, num_dependentes,
    necessidades_especiais, observacoes
  } = req.body;

  try {
    // Verificar se o CPF já existe
    const cpfExistente = await db.query(
      'SELECT * FROM vulneraveis WHERE cpf = $1',
      [cpf]
    );

    if (cpfExistente.rows.length > 0) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Inserir novo vulnerável
    const novoVulneravel = await db.query(
      `INSERT INTO vulneraveis (
        nome_completo, cpf, data_nascimento, genero, estado_civil,
        endereco, bairro, cidade, estado, cep, telefone, email,
        situacao_emprego, renda_familiar, num_dependentes,
        necessidades_especiais, observacoes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        nome_completo, cpf, data_nascimento, genero, estado_civil,
        endereco, bairro, cidade, estado, cep, telefone, email,
        situacao_emprego, renda_familiar, num_dependentes,
        necessidades_especiais, observacoes, 'espera'
      ]
    );

    res.status(201).json({
      message: 'Vulnerável cadastrado com sucesso',
      vulneravel: novoVulneravel.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar vulnerável:', error);
    res.status(500).json({ message: 'Erro ao cadastrar vulnerável' });
  }
};

// Função para listar vulneráveis na fila de espera
const listarFilaEspera = async (req, res) => {
  try {
    const vulneraveis = await db.query(
      `SELECT id, nome_completo, cpf, data_nascimento, telefone, 
              cidade, estado, data_cadastro, situacao_emprego
       FROM vulneraveis 
       WHERE status = 'espera' 
       ORDER BY data_cadastro`,
    );

    res.json(vulneraveis.rows);
  } catch (error) {
    console.error('Erro ao listar fila de espera:', error);
    res.status(500).json({ message: 'Erro ao listar fila de espera' });
  }
};

// Função para obter detalhes de um vulnerável
const getVulneravel = async (req, res) => {
  const { id } = req.params;

  try {
    const vulneravel = await db.query(
      'SELECT * FROM vulneraveis WHERE id = $1',
      [id]
    );

    if (vulneravel.rows.length === 0) {
      return res.status(404).json({ message: 'Vulnerável não encontrado' });
    }

    res.json(vulneravel.rows[0]);
  } catch (error) {
    console.error('Erro ao obter detalhes do vulnerável:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do vulnerável' });
  }
};

// Função para atualizar dados de um vulnerável
const atualizarVulneravel = async (req, res) => {
  const { id } = req.params;
  const { 
    nome_completo, data_nascimento, genero, estado_civil,
    endereco, bairro, cidade, estado, cep, telefone, email,
    situacao_emprego, renda_familiar, num_dependentes,
    necessidades_especiais, observacoes
  } = req.body;

  try {
    const vulneravelAtualizado = await db.query(
      `UPDATE vulneraveis 
       SET nome_completo = COALESCE($1, nome_completo),
           data_nascimento = COALESCE($2, data_nascimento),
           genero = COALESCE($3, genero),
           estado_civil = COALESCE($4, estado_civil),
           endereco = COALESCE($5, endereco),
           bairro = COALESCE($6, bairro),
           cidade = COALESCE($7, cidade),
           estado = COALESCE($8, estado),
           cep = COALESCE($9, cep),
           telefone = COALESCE($10, telefone),
           email = COALESCE($11, email),
           situacao_emprego = COALESCE($12, situacao_emprego),
           renda_familiar = COALESCE($13, renda_familiar),
           num_dependentes = COALESCE($14, num_dependentes),
           necessidades_especiais = COALESCE($15, necessidades_especiais),
           observacoes = COALESCE($16, observacoes)
       WHERE id = $17
       RETURNING *`,
      [
        nome_completo, data_nascimento, genero, estado_civil,
        endereco, bairro, cidade, estado, cep, telefone, email,
        situacao_emprego, renda_familiar, num_dependentes,
        necessidades_especiais, observacoes, id
      ]
    );

    if (vulneravelAtualizado.rows.length === 0) {
      return res.status(404).json({ message: 'Vulnerável não encontrado' });
    }

    res.json({
      message: 'Dados do vulnerável atualizados com sucesso',
      vulneravel: vulneravelAtualizado.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar dados do vulnerável:', error);
    res.status(500).json({ message: 'Erro ao atualizar dados do vulnerável' });
  }
};

// Função para apadrinhar um vulnerável (torná-lo assistido)
const apadrinharVulneravel = async (req, res) => {
  const { id_vulneravel, id_grupo } = req.body;
  const id_gerenciador = req.user.id;

  try {
    // Verificar se o vulnerável existe e está na fila de espera
    const vulneravel = await db.query(
      'SELECT * FROM vulneraveis WHERE id = $1 AND status = $2',
      [id_vulneravel, 'espera']
    );

    if (vulneravel.rows.length === 0) {
      return res.status(400).json({ message: 'Vulnerável não encontrado ou não está na fila de espera' });
    }

    // Verificar se o gerenciador pertence ao grupo
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [id_gerenciador, id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não é gerenciador deste grupo' });
      }
    }

    // Verificar capacidade do grupo
    const assistidosAtivos = await db.query(
      'SELECT COUNT(*) FROM assistidos WHERE id_grupo = $1 AND status = $2',
      [id_grupo, 'ativo']
    );

    const grupo = await db.query('SELECT capacidade_maxima FROM grupos WHERE id = $1', [id_grupo]);
    
    if (parseInt(assistidosAtivos.rows[0].count) >= grupo.rows[0].capacidade_maxima) {
      return res.status(400).json({ message: 'Grupo já atingiu sua capacidade máxima' });
    }

    // Calcular data de fim prevista (3 meses a partir de hoje)
    const dataAtual = new Date();
    const dataFimPrevista = new Date(dataAtual);
    dataFimPrevista.setMonth(dataFimPrevista.getMonth() + 3);

    // Iniciar transação
    await db.query('BEGIN');

    // Criar assistido
    const novoAssistido = await db.query(
      `INSERT INTO assistidos (
        id_vulneravel, id_grupo, id_gerenciador, data_inicio, data_fim_prevista
      ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *`,
      [id_vulneravel, id_grupo, id_gerenciador, dataFimPrevista]
    );

    // Atualizar status do vulnerável
    await db.query(
      'UPDATE vulneraveis SET status = $1 WHERE id = $2',
      ['assistido', id_vulneravel]
    );

    // Finalizar transação
    await db.query('COMMIT');

    res.status(201).json({
      message: 'Vulnerável apadrinhado com sucesso',
      assistido: novoAssistido.rows[0]
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao apadrinhar vulnerável:', error);
    res.status(500).json({ message: 'Erro ao apadrinhar vulnerável' });
  }
};

// Função para listar assistidos de um grupo
const listarAssistidosGrupo = async (req, res) => {
  const { id_grupo } = req.params;

  try {
    // Verificar se o usuário tem permissão para ver os assistidos deste grupo
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [req.user.id, id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não tem permissão para ver os assistidos deste grupo' });
      }
    }

    // Obter assistidos do grupo
    const assistidos = await db.query(
      `SELECT a.id, a.data_inicio, a.data_fim_prevista, a.status,
              v.id as id_vulneravel, v.nome_completo, v.cpf, v.telefone
       FROM assistidos a
       JOIN vulneraveis v ON a.id_vulneravel = v.id
       WHERE a.id_grupo = $1 AND a.status = $2
       ORDER BY a.data_fim_prevista`,
      [id_grupo, 'ativo']
    );

    res.json(assistidos.rows);
  } catch (error) {
    console.error('Erro ao listar assistidos do grupo:', error);
    res.status(500).json({ message: 'Erro ao listar assistidos do grupo' });
  }
};

// Função para obter detalhes de um assistido
const getAssistido = async (req, res) => {
  const { id } = req.params;

  try {
    // Obter dados do assistido
    const assistido = await db.query(
      `SELECT a.*, v.nome_completo, v.cpf, v.data_nascimento, v.telefone,
              g.nome as nome_grupo, u.nome as nome_gerenciador
       FROM assistidos a
       JOIN vulneraveis v ON a.id_vulneravel = v.id
       JOIN grupos g ON a.id_grupo = g.id
       JOIN utilizadores u ON a.id_gerenciador = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (assistido.rows.length === 0) {
      return res.status(404).json({ message: 'Assistido não encontrado' });
    }

    // Verificar se o usuário tem permissão para ver este assistido
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [req.user.id, assistido.rows[0].id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não tem permissão para ver este assistido' });
      }
    }

    // Obter histórico de doações
    const doacoes = await db.query(
      `SELECT d.id, d.data_doacao, d.comprovante_gerado,
              u.nome as gerenciador_nome,
              COUNT(id.id) as quantidade_itens
       FROM doacoes d
       JOIN utilizadores u ON d.id_gerenciador = u.id
       LEFT JOIN itens_doacao id ON d.id = id.id_doacao
       WHERE d.id_assistido = $1
       GROUP BY d.id, u.nome
       ORDER BY d.data_doacao DESC`,
      [id]
    );

    res.json({
      ...assistido.rows[0],
      doacoes: doacoes.rows
    });
  } catch (error) {
    console.error('Erro ao obter detalhes do assistido:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do assistido' });
  }
};

// Função para conceder extensão de prazo a um assistido
const concederExtensao = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  try {
    // Verificar se o assistido existe e está ativo
    const assistido = await db.query(
      'SELECT * FROM assistidos WHERE id = $1 AND status = $2',
      [id, 'ativo']
    );

    if (assistido.rows.length === 0) {
      return res.status(404).json({ message: 'Assistido não encontrado ou não está ativo' });
    }

    // Verificar se o usuário tem permissão para conceder extensão
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [req.user.id, assistido.rows[0].id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não tem permissão para conceder extensão a este assistido' });
      }
    }

    // Verificar se já foi concedida extensão
    if (assistido.rows[0].extensao_concedida) {
      return res.status(400).json({ message: 'Este assistido já recebeu uma extensão de prazo' });
    }

    // Calcular nova data de fim (1 mês adicional)
    const dataFimAtual = new Date(assistido.rows[0].data_fim_prevista);
    const novaDataFim = new Date(dataFimAtual);
    novaDataFim.setMonth(novaDataFim.getMonth() + 1);

    // Atualizar assistido
    const assistidoAtualizado = await db.query(
      `UPDATE assistidos 
       SET data_fim_prevista = $1, 
           extensao_concedida = true,
           detalhes_saida = $2
       WHERE id = $3
       RETURNING *`,
      [novaDataFim, motivo, id]
    );

    res.json({
      message: 'Extensão concedida com sucesso',
      assistido: assistidoAtualizado.rows[0]
    });
  } catch (error) {
    console.error('Erro ao conceder extensão:', error);
    res.status(500).json({ message: 'Erro ao conceder extensão' });
  }
};

// Função para finalizar assistência
const finalizarAssistencia = async (req, res) => {
  const { id } = req.params;
  const { motivo_saida, detalhes_saida } = req.body;

  try {
    // Verificar se o assistido existe e está ativo
    const assistido = await db.query(
      'SELECT * FROM assistidos WHERE id = $1 AND status = $2',
      [id, 'ativo']
    );

    if (assistido.rows.length === 0) {
      return res.status(404).json({ message: 'Assistido não encontrado ou não está ativo' });
    }

    // Verificar se o usuário tem permissão para finalizar assistência
    if (req.user.tipo !== 'admin') {
      const gerenciadorGrupo = await db.query(
        'SELECT * FROM gerenciadores_grupo WHERE id_utilizador = $1 AND id_grupo = $2 AND ativo = true',
        [req.user.id, assistido.rows[0].id_grupo]
      );

      if (gerenciadorGrupo.rows.length === 0) {
        return res.status(403).json({ message: 'Você não tem permissão para finalizar assistência deste assistido' });
      }
    }

    // Iniciar transação
    await db.query('BEGIN');

    // Atualizar assistido
    const assistidoAtualizado = await db.query(
      `UPDATE assistidos 
       SET status = 'inativo', 
           data_fim_real = CURRENT_TIMESTAMP,
           motivo_saida = $1,
           detalhes_saida = $2
       WHERE id = $3
       RETURNING *`,
      [motivo_saida, detalhes_saida, id]
    );

    // Atualizar status do vulnerável
    await db.query(
      'UPDATE vulneraveis SET status = $1 WHERE id = $2',
      ['concluido', assistido.rows[0].id_vulneravel]
    );

    // Finalizar transação
    await db.query('COMMIT');

    res.json({
      message: 'Assistência finalizada com sucesso',
      assistido: assistidoAtualizado.rows[0]
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao finalizar assistência:', error);
    res.status(500).json({ message: 'Erro ao finalizar assistência' });
  }
};

module.exports = {
  cadastrarVulneravel,
  listarFilaEspera,
  getVulneravel,
  atualizarVulneravel,
  apadrinharVulneravel,
  listarAssistidosGrupo,
  getAssistido,
  concederExtensao,
  finalizarAssistencia
};
