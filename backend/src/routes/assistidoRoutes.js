const express = require('express');
const router = express.Router();
const assistidoController = require('../controllers/assistidoController');
const { auth, isAdmin, isGerenciador } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Rotas para gestão de vulneráveis
router.post('/vulneravel', assistidoController.cadastrarVulneravel);
router.get('/vulneravel/fila', isGerenciador, assistidoController.listarFilaEspera);
router.get('/vulneravel/:id', assistidoController.getVulneravel);
router.put('/vulneravel/:id', assistidoController.atualizarVulneravel);

// Rotas para gestão de assistidos
router.post('/apadrinhar', isGerenciador, assistidoController.apadrinharVulneravel);
router.get('/grupo/:id_grupo', isGerenciador, assistidoController.listarAssistidosGrupo);
router.get('/:id', isGerenciador, assistidoController.getAssistido);
router.put('/:id/extensao', isGerenciador, assistidoController.concederExtensao);
router.put('/:id/finalizar', isGerenciador, assistidoController.finalizarAssistencia);

module.exports = router;
