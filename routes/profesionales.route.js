import express from "express";
import * as profesionalesController from "../controllers/profesionales.controller.js";

const router = express.Router();

// API JSON
router.get('/api/', profesionalesController.getProfesionales);
router.get('/api/:id', profesionalesController.getProfesionalById);
router.post('/api/', profesionalesController.createProfesional);
router.put('/api/:id', profesionalesController.updateProfesional);
router.delete('/api/:id', profesionalesController.deleteProfesional);

// Vistas (solo muestra + formularios)
router.get('/vista', profesionalesController.renderProfesionales);
router.get('/vista/:id', profesionalesController.renderProfesionalById);

export default router;