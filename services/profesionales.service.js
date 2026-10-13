import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/profesionales.json');

//Lee los profesionales del archivo data/profesionales.json
function readProfesionales() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

//Edita/crea el/los profesional/es del archivo data/profesionales.json
function writeProfesionales(profesionales) {
    fs.writeFileSync(dataPath, JSON.stringify(profesionales, null, 2));
}

// Devuelve todos los profesionales
export const getAll = () => readProfesionales();

// Busca un profesional por id
export const getById = (id) => readProfesionales().find((p) => p.id === Number(id));

// Crea un profesional nuevo, generando un id que no esté en uso
export const create = (data) => {
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.especialidad || !data.matricula) {
        const err = new Error("Faltan datos obligatorios para crear un profesional");
        err.status = 400;
        throw err;
        //
    }
    if (data.matricula && readProfesionales().some((p) => p.matricula === data.matricula)) {
        const err = new Error("La matrícula ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }
    if (data.email && readProfesionales().some((p) => p.email === data.email)) {
        const err = new Error("El email ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }
    if (data.telefono && readProfesionales().some((p) => p.telefono === data.telefono)) {
        const err = new Error("El teléfono ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }

    const profesionales = readProfesionales();
    let nextId = profesionales.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    while (profesionales.some((p) => p.id === nextId)) nextId++;
    const profesional = { id: nextId, nombre: data.nombre, apellido: data.apellido, email: data.email, telefono: data.telefono, especialidad: data.especialidad, matricula: data.matricula };
    profesionales.push(profesional);
    writeProfesionales(profesionales);
    return profesional;
};

// Actualiza los datos de un profesional existente, mantiene el id original
export const update = (id, data) => {
    const profesionales = readProfesionales();
    const index = profesionales.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    //que no se repita matricula, email o telefono con otro profesional
    if (data.matricula && profesionales.some((p) => p.matricula === data.matricula && p.id !== Number(id))) {
        const err = new Error("La matrícula ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }
    if (data.email && profesionales.some((p) => p.email === data.email && p.id !== Number(id))) {
        const err = new Error("El email ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }
    if (data.telefono && profesionales.some((p) => p.telefono === data.telefono && p.id !== Number(id))) {
        const err = new Error("El teléfono ya está en uso por otro profesional");
        err.status = 400;
        throw err;
    }
    profesionales[index] = { ...profesionales[index], ...data, id: profesionales[index].id };
    writeProfesionales(profesionales);
    return profesionales[index];
};

export const remove = (id) => {
    const profesionales = readProfesionales();
    const index = profesionales.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    const [deleted] = profesionales.splice(index, 1);
    writeProfesionales(profesionales);
    return deleted;
};