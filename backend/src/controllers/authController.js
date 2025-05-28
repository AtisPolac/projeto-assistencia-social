const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Função para registrar um novo utilizador
const registarUtilizador = async (req, res) => {
  const { nome, email, password, tipo } = req.body;

  try {
    // Verificar se o email já existe
    const utilizadorExistente = await db.query(
      'SELECT * FROM utilizadores WHERE email = $1',
      [email]
    );

    if (utilizadorExistente.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registado' });
    }

    // Hash da password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir novo utilizador
    const novoUtilizador = await db.query(
      'INSERT INTO utilizadores (nome, email, password, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo',
      [nome, email, hashedPassword, tipo]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { id: novoUtilizador.rows[0].id, tipo: novoUtilizador.rows[0].tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Utilizador registado com sucesso',
      token,
      utilizador: {
        id: novoUtilizador.rows[0].id,
        nome: novoUtilizador.rows[0].nome,
        email: novoUtilizador.rows[0].email,
        tipo: novoUtilizador.rows[0].tipo
      }
    });
  } catch (error) {
    console.error('Erro ao registar utilizador:', error);
    res.status(500).json({ message: 'Erro ao registar utilizador' });
  }
};

// Função para autenticar um utilizador
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o utilizador existe
    const utilizador = await db.query(
      'SELECT * FROM utilizadores WHERE email = $1',
      [email]
    );

    if (utilizador.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, utilizador.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Atualizar último acesso
    await db.query(
      'UPDATE utilizadores SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1',
      [utilizador.rows[0].id]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { id: utilizador.rows[0].id, tipo: utilizador.rows[0].tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      utilizador: {
        id: utilizador.rows[0].id,
        nome: utilizador.rows[0].nome,
        email: utilizador.rows[0].email,
        tipo: utilizador.rows[0].tipo
      }
    });
  } catch (error) {
    console.error('Erro ao autenticar utilizador:', error);
    res.status(500).json({ message: 'Erro ao autenticar utilizador' });
  }
};

// Função para obter perfil do utilizador
const getPerfil = async (req, res) => {
  try {
    const utilizador = await db.query(
      'SELECT id, nome, email, tipo, data_criacao, ultimo_acesso FROM utilizadores WHERE id = $1',
      [req.user.id]
    );

    if (utilizador.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    res.json(utilizador.rows[0]);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil' });
  }
};

// Função para atualizar perfil do utilizador
const atualizarPerfil = async (req, res) => {
  const { nome, email } = req.body;

  try {
    // Verificar se o email já existe (se for diferente do atual)
    if (email) {
      const emailExistente = await db.query(
        'SELECT * FROM utilizadores WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (emailExistente.rows.length > 0) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    // Atualizar perfil
    const utilizadorAtualizado = await db.query(
      'UPDATE utilizadores SET nome = COALESCE($1, nome), email = COALESCE($2, email) WHERE id = $3 RETURNING id, nome, email, tipo',
      [nome, email, req.user.id]
    );

    res.json({
      message: 'Perfil atualizado com sucesso',
      utilizador: utilizadorAtualizado.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Função para alterar password
const alterarPassword = async (req, res) => {
  const { passwordAtual, novaSenha } = req.body;

  try {
    // Obter utilizador
    const utilizador = await db.query(
      'SELECT * FROM utilizadores WHERE id = $1',
      [req.user.id]
    );

    // Verificar password atual
    const isMatch = await bcrypt.compare(passwordAtual, utilizador.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password atual incorreta' });
    }

    // Hash da nova password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(novaSenha, salt);

    // Atualizar password
    await db.query(
      'UPDATE utilizadores SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar password:', error);
    res.status(500).json({ message: 'Erro ao alterar password' });
  }
};

// Função para listar utilizadores (apenas para administradores)
const listarUtilizadores = async (req, res) => {
  try {
    const utilizadores = await db.query(
      'SELECT id, nome, email, tipo, ativo, data_criacao, ultimo_acesso FROM utilizadores ORDER BY nome'
    );

    res.json(utilizadores.rows);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).json({ message: 'Erro ao listar utilizadores' });
  }
};

module.exports = {
  registarUtilizador,
  login,
  getPerfil,
  atualizarPerfil,
  alterarPassword,
  listarUtilizadores
};
