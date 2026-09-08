const fs = require('fs');
const path = require('path');
const profesionalesService = require('../services/profesionales.service');
const clientesService = require('../services/clientes.service');

const filePath = path.join(__dirname, '../data/turnos.json');

// Auxiliares para JSON
const leerTurnos = () => {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(data || '[]');
};

const guardarTurnos = (turnos) => {
  fs.writeFileSync(
    filePath,
    JSON.stringify(turnos, null, 2),
    'utf-8'
  );
};

const fechaValida = (fecha) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

// --- Controladores ---

// GET: Obtener todos los turnos
exports.obtenerTurnos = (req, res) => {
  try {
    const { profesionalId, clienteId, fecha, estado } = req.query;
    const filtros = { profesionalId, clienteId, fecha, estado };
    const filtrosUsados = Object.entries(filtros).filter(([, valor]) => valor !== undefined);
    const estadosValidos = ['reservado', 'cancelado', 'atendido'];

    if (profesionalId !== undefined && !Number.isInteger(Number(profesionalId))) {
      return res.status(400).json({ error: 'profesionalId debe ser un número entero' });
    }
    if (clienteId !== undefined && !Number.isInteger(Number(clienteId))) {
      return res.status(400).json({ error: 'clienteId debe ser un número entero' });
    }
    if (fecha !== undefined && !fechaValida(fecha)) {
      return res.status(400).json({ error: 'fecha debe tener el formato YYYY-MM-DD y ser válida' });
    }
    if (estado !== undefined && !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'estado debe ser reservado, cancelado o atendido' });
    }

    const turnos = leerTurnos().filter((turno) => filtrosUsados.every(([campo, valor]) => {
      if (campo === 'profesionalId' || campo === 'clienteId') {
        return Number(turno[campo]) === Number(valor);
      }
      return turno[campo] === valor;
    }));

    res.status(200).json(turnos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener los turnos'
    });
  }
};


// POST: Crear / Reservar un turno
exports.crearTurno = (req, res) => {
  try {
    const {
      profesionalId,
      clienteId,
      fecha,
      hora
    } = req.body || {};

    // Validar que lleguen todos los datos
    if (
      profesionalId === undefined ||
      clienteId === undefined ||
      !fecha ||
      !hora
    ) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    // Convertir IDs a números, para que no haya comflictos en caso que ingrese un str en vez de int
    const profesionalIdNum = Number(profesionalId);
    const clienteIdNum = Number(clienteId);

    if (
      !Number.isInteger(profesionalIdNum) ||
      !Number.isInteger(clienteIdNum)
    ) {
      return res.status(400).json({
        error: 'profesionalId y clienteId deben ser números'
      });
    }

    // Validar formato de fecha YYYY-MM-DD
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!fechaRegex.test(fecha) || !fechaValida(fecha)) {
      return res.status(400).json({
        error: 'La fecha debe ser válida y tener el formato YYYY-MM-DD'
      });
    }

    // Validar formato de hora HH:MM
    const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!horaRegex.test(hora)) {
      return res.status(400).json({
        error: 'La hora debe tener el formato HH:MM'
      });
    }

    if (!profesionalesService.getById(profesionalIdNum)) {
      return res.status(404).json({
        error: 'El profesional indicado no existe'
      });
    }

    if (!clientesService.getById(clienteIdNum)) {
      return res.status(404).json({
        error: 'El cliente indicado no existe'
      });
    }

    const turnos = leerTurnos();

    // Regla 1:
    // Un profesional no puede tener dos turnos
    // reservados en el mismo horario.
    const profesionalOcupado = turnos.some(t =>
      Number(t.profesionalId) === profesionalIdNum &&
      t.fecha === fecha &&
      t.hora === hora &&
      t.estado === 'reservado'
    );

    if (profesionalOcupado) {
      return res.status(409).json({
        error: 'El profesional ya tiene un turno reservado en ese horario'
      });
    }

    // Regla 2:
    // Un cliente no puede tener dos turnos
    // reservados en el mismo horario.
    const clienteDuplicado = turnos.some(t =>
      Number(t.clienteId) === clienteIdNum &&
      t.fecha === fecha &&
      t.hora === hora &&
      t.estado === 'reservado'
    );

    if (clienteDuplicado) {
      return res.status(409).json({
        error: 'El cliente ya tiene un turno reservado a esa hora'
      });
    }

    


    // Generar un ID nuevo tomando el ID más alto
    const nuevoId = turnos.length > 0
      ? Math.max(...turnos.map(t => Number(t.id) || 0)) + 1
      : 1;

    const nuevoTurno = {
      id: nuevoId,
      profesionalId: profesionalIdNum,
      clienteId: clienteIdNum,
      fecha,
      hora,
      estado: 'reservado'
    };

    turnos.push(nuevoTurno);

    guardarTurnos(turnos);

    res.status(201).json({
      mensaje: 'Turno reservado exitosamente',
      turno: nuevoTurno
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error interno al reservar el turno'
    });
  }
};


// PATCH: Modificar el estado del turno
exports.cambiarEstado = (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    //Regla 3: los estados que puede tener un turno son: reservado, cancelado y atendido.
    const estadosValidos = [
      'reservado',
      'cancelado',
      'atendido'
    ];

    // Validar estado
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: 'Estado no válido. Use: reservado, cancelado o atendido'
      });
    }

    const turnoId = Number(id);

    if (!Number.isInteger(turnoId)) {
      return res.status(400).json({
        error: 'El ID del turno debe ser un número'
      });
    }

    const turnos = leerTurnos();

    const turno = turnos.find(t =>
      Number(t.id) === turnoId
    );

    // Verificar que exista
    if (!turno) {
      return res.status(404).json({
        error: 'Turno no encontrado'
      });
    }

    // Si se intenta volver a reservar un turno, verificar que no exista otro turno ocupado para el mismo profesional.
    if (estado === 'reservado') {

      const profesionalOcupado = turnos.some(t =>
        Number(t.id) !== turnoId &&
        Number(t.profesionalId) === Number(turno.profesionalId) &&
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.estado === 'reservado'
      );

      if (profesionalOcupado) {
        return res.status(409).json({
          error: 'El profesional ya tiene otro turno reservado en ese horario'
        });
      }

      // Verificar también que el cliente no tenga otro turno en ese horario.
      const clienteDuplicado = turnos.some(t =>
        Number(t.id) !== turnoId &&
        Number(t.clienteId) === Number(turno.clienteId) &&
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.estado === 'reservado'
      );

      if (clienteDuplicado) {
        return res.status(409).json({
          error: 'El cliente ya tiene otro turno reservado en ese horario'
        });
      }
    }

    // Cambiar estado
    turno.estado = estado;

    guardarTurnos(turnos);

    res.status(200).json({
      mensaje: `El turno cambió a estado: ${estado}`,
      turno
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al actualizar el estado del turno'
    });
  }
};
