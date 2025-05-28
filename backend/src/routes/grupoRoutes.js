const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const { auth, isAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Rotas para gestão de grupos
router.post('/', isAdmin, grupoController.criarGrupo);
router.get('/', grupoController.listarGrupos);
router.get('/:id', grupoController.getGrupo);
router.put('/:id', isAdmin, grupoController.atualizarGrupo);

// Rotas para gestão de gerenciadores de grupo
router.post('/gerenciador', isAdmin, grupoController.atribuirGerenciador);
router.delete('/gerenciador/:id_grupo/:id_utilizador', isAdmin, grupoController.removerGerenciador);

module.exports = router;
