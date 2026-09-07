const express = require('express');
const router = express.Router();
const DisponibilidadController = require('../controllers/disponibilidad.controller');

const disponibilidadController = new DisponibilidadController();

// Rutas específicas primero
router.get('/', disponibilidadController.getAll);
router.get('/profesional/:profesionalId', disponibilidadController.getByProfesional);
router.get('/dia/:dia', disponibilidadController.getByDia);
router.get('/:id', disponibilidadController.getById);
router.post('/', disponibilidadController.create);
router.put('/:id', disponibilidadController.update);
router.delete('/:id', disponibilidadController.delete);

module.exports = router;