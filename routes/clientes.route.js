
const router = require('express').Router();
const clientesController = require('../controllers/clientes.controller');
const validacionesClientes = require('../middlewares/validacionesClientes');

router.get('/api/', clientesController.getClientes);
router.get('/api/:id', clientesController.getClienteById);
router.post('/api/', validacionesClientes.validarDatos, clientesController.createCliente);
router.put('/api/:id', validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;


// ruter para vistas solo muestra -

router.get('/vista', clientesController.renderClientes);
router.get('/vista/:id', clientesController.renderClienteById);