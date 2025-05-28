const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');
const comprovantePDFController = require('../controllers/comprovantePDFController');
const { auth, isGerenciador } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Rotas para gestão de doações
router.post('/', isGerenciador, doacaoController.criarDoacao);
router.get('/', isGerenciador, doacaoController.listarDoacoes);
router.get('/:id', isGerenciador, doacaoController.getDoacao);
router.get('/:id/comprovante', isGerenciador, doacaoController.gerarComprovante);
router.get('/:id/comprovante/pdf', isGerenciador, comprovantePDFController.gerarComprovantePDF);

module.exports = router;
