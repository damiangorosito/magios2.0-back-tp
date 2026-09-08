const DisponibilidadService = require('../services/disponibilidad.service');

const disponibilidadService = new DisponibilidadService();

class DisponibilidadController {

  // Obtener todas las disponibilidades
  getAll(req, res) {
    try {
      const disponibilidades = disponibilidadService.getAll();
      res.status(200).json(disponibilidades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener disponibilidad por ID
  getById(req, res) {
    try {
      const { id } = req.params;
      const disponibilidad = disponibilidadService.getById(id);

      if (!disponibilidad) {
        return res.status(404).json({ error: 'Disponibilidad no encontrada' });
      }

      res.status(200).json(disponibilidad);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener disponibilidades por profesional
  getByProfesional(req, res) {
    try {
      const { profesionalId } = req.params;
      const disponibilidades = disponibilidadService.getByProfesional(profesionalId);
      res.status(200).json(disponibilidades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener disponibilidades por día
  getByDia(req, res) {
    try {
      const { dia } = req.params;
      const disponibilidades = disponibilidadService.getByDia(dia);
      res.status(200).json(disponibilidades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear nueva disponibilidad
  create(req, res) {
    try {
      const { profesionalId, dia, horaInicio, horaFin } = req.body;

      // Validaciones básicas
      if (!profesionalId || !dia || !horaInicio || !horaFin) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos: profesionalId, dia, horaInicio, horaFin' 
        });
      }

      // Validar formato de hora (HH:MM)
      const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
        return res.status(400).json({ 
          error: 'Formato de hora inválido. Use HH:MM (ej: 09:00)' 
        });
      }

      // Validar que horaInicio sea menor que horaFin
      if (horaInicio >= horaFin) {
        return res.status(400).json({ 
          error: 'La hora de inicio debe ser menor que la hora de fin' 
        });
      }

      // Validar día válido
      const diasValidos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
      if (!diasValidos.includes(dia.toLowerCase())) {
        return res.status(400).json({ 
          error: 'Día inválido. Use: lunes, martes, miércoles, jueves, viernes, sábado, domingo' 
        });
      }

      const nuevaDisponibilidad = disponibilidadService.create({
        profesionalId,
        dia: dia.toLowerCase(),
        horaInicio,
        horaFin
      });

      res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar disponibilidad
  update(req, res) {
    try {
      const { id } = req.params;
      const { profesionalId, dia, horaInicio, horaFin, activo } = req.body;

      const disponibilidadExistente = disponibilidadService.getById(id);
      if (!disponibilidadExistente) {
        return res.status(404).json({ error: 'Disponibilidad no encontrada' });
      }

      // Validar formato de hora si se proporcionan
      const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (horaInicio && !horaRegex.test(horaInicio)) {
        return res.status(400).json({ error: 'Formato de hora inválido para horaInicio' });
      }
      if (horaFin && !horaRegex.test(horaFin)) {
        return res.status(400).json({ error: 'Formato de hora inválido para horaFin' });
      }

      // Validar que horaInicio < horaFin si ambos se proporcionan
      if (horaInicio && horaFin && horaInicio >= horaFin) {
        return res.status(400).json({ 
          error: 'La hora de inicio debe ser menor que la hora de fin' 
        });
      }

      const updateData = {};
      if (profesionalId !== undefined) updateData.profesionalId = profesionalId;
      if (dia !== undefined) updateData.dia = dia.toLowerCase();
      if (horaInicio !== undefined) updateData.horaInicio = horaInicio;
      if (horaFin !== undefined) updateData.horaFin = horaFin;
      if (activo !== undefined) updateData.activo = activo;

      const disponibilidadActualizada = disponibilidadService.update(id, updateData);

      res.status(200).json(disponibilidadActualizada);
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar disponibilidad
  delete(req, res) {
    try {
      const { id } = req.params;
      const disponibilidad = disponibilidadService.delete(id);
      res.status(200).json({ 
        message: 'Disponibilidad eliminada correctamente',
        disponibilidad 
      });
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DisponibilidadController;