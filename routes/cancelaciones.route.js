import express from "express";
import * as cancelacionesController from "../controllers/cancelaciones.controller.js";

const router = express.Router();

router.get('/', cancelacionesController.getCancelaciones);
router.post('/', cancelacionesController.createCancelacion);

export default router;