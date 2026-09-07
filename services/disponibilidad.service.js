const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/disponibilidad_horaria.json');

class DisponibilidadService {
  constructor() {
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
    }
  }

  readData() {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  }

  writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  }

  // Obtener todas las disponibilidades
  getAll() {
    return this.readData();
  }

  // Obtener disponibilidad por ID
  getById(id) {
    const disponibilidades = this.readData();
    return disponibilidades.find(d => String(d.id) === String(id));
  }

  // Obtener disponibilidades por profesional
  getByProfesional(profesionalId) {
    const disponibilidades = this.readData();
    return disponibilidades.filter(d => String(d.profesionalId) === String(profesionalId));
  }

  // Obtener disponibilidades por día
  getByDia(dia) {
    const disponibilidades = this.readData();
    return disponibilidades.filter(d => d.dia.toLowerCase() === String(dia).toLowerCase());
  }

  // Crear nueva disponibilidad
  create(disponibilidadData) {
    const disponibilidades = this.readData();
    
    // Validar que no exista duplicado (mismo profesional, día y horario)
    const existe = disponibilidades.some(d => 
      d.profesionalId === disponibilidadData.profesionalId &&
      d.dia === disponibilidadData.dia &&
      d.horaInicio === disponibilidadData.horaInicio &&
      d.horaFin === disponibilidadData.horaFin
    );

    if (existe) {
      throw new Error('Ya existe esta disponibilidad para el profesional en ese día y horario');
    }

    const nuevaDisponibilidad = {
      id: Date.now().toString(),
      profesionalId: disponibilidadData.profesionalId,
      dia: disponibilidadData.dia,
      horaInicio: disponibilidadData.horaInicio,
      horaFin: disponibilidadData.horaFin,
      activo: true,
      createdAt: new Date().toISOString()
    };

    disponibilidades.push(nuevaDisponibilidad);
    this.writeData(disponibilidades);
    return nuevaDisponibilidad;
  }

  // Actualizar disponibilidad
  update(id, updateData) {
    const disponibilidades = this.readData();
    const index = disponibilidades.findIndex(d => String(d.id) === String(id));

    if (index === -1) {
      throw new Error('Disponibilidad no encontrada');
    }

    const disponibilidadActualizada = {
      ...disponibilidades[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    disponibilidades[index] = disponibilidadActualizada;
    this.writeData(disponibilidades);
    return disponibilidadActualizada;
  }

  // Eliminar disponibilidad
  delete(id) {
    let disponibilidades = this.readData();
    const index = disponibilidades.findIndex(d => String(d.id) === String(id));

    if (index === -1) {
      throw new Error('Disponibilidad no encontrada');
    }

    const [deleted] = disponibilidades.splice(index, 1);
    this.writeData(disponibilidades);
    return deleted;
  }
}

module.exports = DisponibilidadService;