import * as profesionalesService from "../services/profesionales.service.js";

const validarId = (id) => /^\d+$/.test(String(id))
const validarProfesional = (data) => {
  const campos = ['nombre', 'apellido', 'email', 'telefono', 'especialidad', 'matricula']
  return data && campos.every((campo) => typeof data[campo] === 'string' && data[campo].trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
}

// Obtener todos los profesionales
export const getProfesionales = (req, res) => {
  res.json(profesionalesService.getAll())
}

// Obtener un profesional por ID
export const getProfesionalById = (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'El ID del profesional debe ser un número entero' })
  }
  const profesional = profesionalesService.getById(req.params.id)
  if (!profesional) {
    return res.status(404).json({ message: 'Profesional no encontrado' })
  }
  res.json(profesional)
}

// Crear un nuevo profesional
export const createProfesional = (req, res) => {
  try {
    if (!validarProfesional(req.body)) {
      return res.status(400).json({
        message: 'nombre, apellido, email, telefono, especialidad y matricula son obligatorios; email debe ser válido'
      })
    }
    const profesional = profesionalesService.create(req.body)
    res.status(201).json(profesional)
  } catch (error) {

    res.status(error.message.includes('uso') ? 409 : 500).json({ message: error.message })
  }
}

// Actualizar un profesional existente
export const updateProfesional = (req, res) => {

  try{

    if (!validarId(req.params.id)) {
      return res.status(400).json({ message: 'El ID del profesional debe ser un número entero' })
    }
    if (!validarProfesional(req.body)) {
      return res.status(400).json({
        message: 'nombre, apellido, email, telefono, especialidad y matricula son obligatorios; email debe ser válido'
      })
    }
  
  
    const profesional = profesionalesService.update(req.params.id, req.body)
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' })
    }
    res.json(profesional)
  } catch (error) {
    res.status(error.message.includes('uso') ? 409 : 500).json({ message: error.message })
  }
}

// Eliminar un profesional
export const deleteProfesional = (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'El ID del profesional debe ser un número entero' })
  }
  const profesional = profesionalesService.remove(req.params.id)
  if (!profesional) {
    return res.status(404).json({ message: 'Profesional no encontrado' })
  }
  res.json({ message: 'Profesional eliminado' })
}
