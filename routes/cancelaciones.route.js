
const router = require('express').Router();
const cancelacionesController = require('../controllers/cancelaciones.controller');

router.get('/', cancelacionesController.getCancelaciones);
router.post('/', cancelacionesController.createCancelacion);

module.exports = router;