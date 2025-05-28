const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Middleware para verificar token JWT
const auth = async (req, res, next) => {
  try {
    // Obter token do cabeçalho
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o utilizador existe e está ativo
    const utilizador = await db.query(
      'SELECT * FROM utilizadores WHERE id = $1 AND ativo = true',
      [decoded.id]
    );

    if (utilizador.rows.length === 0) {
      throw new Error();
    }

    // Adicionar utilizador e token ao request
    req.token = token;
    req.user = {
      id: decoded.id,
      tipo: decoded.tipo
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Por favor autentique-se' });
  }
};

// Middleware para verificar se é administrador
const isAdmin = (req, res, next) => {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
  }
  next();
};

// Middleware para verificar se é gerenciador
const isGerenciador = (req, res, next) => {
  if (req.user.tipo !== 'gerenciador' && req.user.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas gerenciadores podem realizar esta operação.' });
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
  isGerenciador
};
