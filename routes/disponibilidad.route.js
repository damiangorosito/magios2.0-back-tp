import express from "express";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";

const router = express.Router();
const disponibilidadController = new DisponibilidadController();

// Rutas específicas primero
router.get('/', disponibilidadController.getAll);
router.get('/profesional/:profesionalId', disponibilidadController.getByProfesional);
router.get('/dia/:dia', disponibilidadController.getByDia);
router.get('/:id', disponibilidadController.getById);
router.post('/', disponibilidadController.create);
router.put('/:id', disponibilidadController.update);
router.delete('/:id', disponibilidadController.delete);

export default router;