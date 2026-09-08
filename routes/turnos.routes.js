const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller');

router.get('/', turnosController.obtenerTurnos);
router.post('/', turnosController.crearTurno);
router.put('/:id', turnosController.cambiarEstado);

module.exports = router;
