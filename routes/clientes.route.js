import express from "express";
import * as clientesController from "../controllers/clientes.controller.js";
import * as validacionesClientes from "../middlewares/validacionesClientes.js";

const router = express.Router();

router.get('/api/', clientesController.getClientes);
router.get('/api/:id', clientesController.getClienteById);
router.post('/api/', validacionesClientes.validarDatos, clientesController.createCliente);
router.put('/api/:id', validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

// ruter para vistas solo muestra -
router.get('/vista', clientesController.renderClientes);
router.get('/vista/:id', clientesController.renderClienteById);

export default router;