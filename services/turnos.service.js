const fs = require('fs')
const path = require('path')


const turnosFilePath = path.join(__dirname, '../data/turnos.json')

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

exports.getAllTurnos = () => {
    return getTurnos()
}

exports.getTurnoById = (id) => {
    const turnos = getTurnos()
    return turnos.find((t) => t.id === Number(id))
}

exports.updateTurno = (id, data) => {
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

exports.deleteTurno = (id) => {
    const turnos = getTurnos()
    const index = turnos.findIndex((t) => t.id_turno === Number(id))
    if (index === -1) return false
    turnos.splice(index, 1)
    saveTurnos(turnos)
    return true
}
