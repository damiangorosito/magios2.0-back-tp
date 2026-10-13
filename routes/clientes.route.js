import express from "express";
import * as clientesController from "../controllers/clientes.controller.js";
import * as validacionesClientes from "../middlewares/validacionesClientes.js";

const router = express.Router();

router.get('/', clientesController.getClientes);
router.get('/:id', clientesController.getClienteById);
router.post('/', validacionesClientes.validarDatos, clientesController.createCliente);
router.put('/:id', validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

export default router;
