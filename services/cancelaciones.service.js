import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cancelacionesFilePath = path.join(__dirname, '../data/cancelaciones.json');

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

export const getAllCancelaciones = () => {
  return getCancelaciones()
}

export const getCancelacionById = (id) => {
  const cancelaciones = getCancelaciones()
  return cancelaciones.find((c) => c.id_cancelacion === Number(id))
}

export const createCancelacion = (data) => {
  const cancelaciones = getCancelaciones()
  let nextId =
    cancelaciones.reduce((max, c) => Math.max(max, c.id_cancelacion), 0) + 1
  while (cancelaciones.some((c) => c.id_cancelacion === nextId)) nextId++
  const newCancelacion = { ...data, id_cancelacion: nextId }
  cancelaciones.push(newCancelacion)
  saveCancelaciones(cancelaciones)
  return newCancelacion
}

export const updateCancelacion = (id, data) => {
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
