

const cancelacionesService = require('../services/cancelaciones.service');
const turnosService = require('../services/turnos.service');

const validarId = (id) => /^\d+$/.test(String(id));


exports.getCancelaciones = (req, res) => {
    try {
        const cancelaciones = cancelacionesService.getAllCancelaciones();
        res.json(cancelaciones);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las cancelaciones' });
    }
};

exports.createCancelacion = (req, res) => {
    try {
        const { id_turno, motivo, fecha_cancelacion, hora_cancelacion } = req.body || {};
        if (!id_turno || !motivo || !fecha_cancelacion || !hora_cancelacion) {
            return res.status(400).json({ message: 'id_turno, motivo, fecha_cancelacion y hora_cancelacion son obligatorios' });
        }

        const turno = turnosService.getTurnoById(id_turno);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        // si turno ya esta cancelado, no se puede cancelar
        if (turno.estado === 'cancelado') {
            return res.status(400).json({ message: 'El turno ya está cancelado' });
        }

        // verificamos que no exista la cancelación para el turno
        const cancelaciones = cancelacionesService.getAllCancelaciones();
        const cancelacionExistente = cancelaciones.find((c) => c.id_turno === Number(id_turno));
        if (cancelacionExistente) {
            return res.status(400).json({ message: 'Ya existe una cancelación para este turno' });
        }

        if (cancelacionExistente) {
            return res.status(400).json({ message: 'Ya existe una cancelación para este turno' });
        }

        // cancelamos el turno en el turnosService
        turnosService.updateTurno(id_turno, { estado: 'cancelado' });

        const newCancelacion = cancelacionesService.createCancelacion({ id_turno, motivo, fecha_cancelacion, hora_cancelacion });

        res.status(201).json(newCancelacion);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la cancelación' });
    }
};