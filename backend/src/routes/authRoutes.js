const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/registar', authController.registarUtilizador);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/perfil', auth, authController.getPerfil);
router.put('/perfil', auth, authController.atualizarPerfil);
router.put('/alterar-password', auth, authController.alterarPassword);
router.get('/utilizadores', auth, isAdmin, authController.listarUtilizadores);

module.exports = router;
