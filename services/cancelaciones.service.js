const fs = require('fs')
const path = require('path')

const cancelacionesFilePath = path.join(__dirname, '../data/cancelaciones.json')

function getCancelaciones() {
  const cancelacionesData = fs.readFileSync(cancelacionesFilePath, 'utf-8')
  return JSON.parse(cancelacionesData)
}

function saveCancelaciones(cancelaciones) {
  fs.writeFileSync(
    cancelacionesFilePath,
    JSON.stringify(cancelaciones, null, 2),
  )
}

exports.getAllCancelaciones = () => {
  return getCancelaciones()
}

exports.getCancelacionById = (id) => {
  const cancelaciones = getCancelaciones()
  return cancelaciones.find((c) => c.id_cancelacion === Number(id))
}

exports.createCancelacion = (data) => {
  const cancelaciones = getCancelaciones()
  let nextId =
    cancelaciones.reduce((max, c) => Math.max(max, c.id_cancelacion), 0) + 1
  while (cancelaciones.some((c) => c.id_cancelacion === nextId)) nextId++
  const newCancelacion = { ...data, id_cancelacion: nextId }
  cancelaciones.push(newCancelacion)
  saveCancelaciones(cancelaciones)
  return newCancelacion
}

exports.updateCancelacion = (id, data) => {
  const cancelaciones = getCancelaciones()
  const index = cancelaciones.findIndex((c) => c.id_cancelacion === Number(id))
  if (index === -1) return null
  cancelaciones[index] = {
    ...cancelaciones[index],
    ...data,
    id_cancelacion: cancelaciones[index].id_cancelacion,
  }
  saveCancelaciones(cancelaciones)
  return cancelaciones[index]
}
