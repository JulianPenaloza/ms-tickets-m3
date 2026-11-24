const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { autenticar, requerirRol } = require('../middleware/auth');

router.use(autenticar);

router.get('/', ticketController.listar);
router.get('/:id', ticketController.obtenerPorId);
router.post('/', requerirRol('administrador'), ticketController.crear);
router.put('/:id', requerirRol('administrador'), ticketController.actualizar);
router.delete('/:id', requerirRol('administrador'), ticketController.eliminar);

module.exports = router;
