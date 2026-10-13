import express from "express";
import * as profesionalesController from "../controllers/profesionales.controller.js";

const router = express.Router();

router.get('/', profesionalesController.getProfesionales);
router.get('/:id', profesionalesController.getProfesionalById);
router.post('/', profesionalesController.createProfesional);
router.put('/:id', profesionalesController.updateProfesional);
router.delete('/:id', profesionalesController.deleteProfesional);

export default router;