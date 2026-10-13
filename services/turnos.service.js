import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const turnosFilePath = path.join(__dirname, '../data/turnos.json');

function getTurnos() {
  const turnosData = fs.readFileSync(turnosFilePath, 'utf-8')
  return JSON.parse(turnosData)
}

function saveTurnos(turnos) {
  fs.writeFileSync(
    turnosFilePath,
    JSON.stringify(turnos, null, 2),
  )
}

export const getAllTurnos = () => {
    return getTurnos()
}

export const getTurnoById = (id) => {
    const turnos = getTurnos()
    return turnos.find((t) => t.id === Number(id))
}

export const updateTurno = (id, data) => {
    const turnos = getTurnos()
    const index = turnos.findIndex((t) => t.id === Number(id))
    if (index === -1) return null
    turnos[index] = {
        ...turnos[index],
        ...data,
        id_turno: turnos[index].id_turno,
    }
    saveTurnos(turnos)
    return turnos[index]
}

export const deleteTurno = (id) => {
    const turnos = getTurnos()
    const index = turnos.findIndex((t) => t.id_turno === Number(id))
    if (index === -1) return false
    turnos.splice(index, 1)
    saveTurnos(turnos)
    return true
}
