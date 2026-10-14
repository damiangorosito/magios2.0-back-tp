import express from "express";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";

const router = express.Router();
const disponibilidadController = new DisponibilidadController();

// API JSON (rutas específicas primero)
router.get('/api/', disponibilidadController.getAll);
router.get('/api/profesional/:profesionalId', disponibilidadController.getByProfesional);
router.get('/api/dia/:dia', disponibilidadController.getByDia);
router.get('/api/:id', disponibilidadController.getById);
router.post('/api/', disponibilidadController.create);
router.put('/api/:id', disponibilidadController.update);
router.delete('/api/:id', disponibilidadController.delete);

// Vistas (solo muestra + formularios)
router.get('/vista', disponibilidadController.renderDisponibilidades);
router.get('/vista/:id', disponibilidadController.renderDisponibilidadById);

export default router;