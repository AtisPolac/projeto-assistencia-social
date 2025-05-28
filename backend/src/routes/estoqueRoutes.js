const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const { auth, isAdmin, isGerenciador } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Rotas para gestão de itens
router.post('/', isGerenciador, estoqueController.cadastrarItem);
router.get('/', estoqueController.listarItens);
router.get('/baixo-estoque', isGerenciador, estoqueController.listarEstoqueBaixo);
router.get('/:id', estoqueController.getItem);
router.put('/:id', isGerenciador, estoqueController.atualizarItem);

// Rotas para movimentação de estoque
router.post('/entrada', isGerenciador, estoqueController.registrarEntrada);
router.post('/ajuste', isAdmin, estoqueController.registrarAjuste);

module.exports = router;
