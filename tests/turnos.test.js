//PRUEBAS AUTOMATICAS

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Cargar el controlador real de turnos
const source = fs.readFileSync(
  path.join(__dirname, '../controllers/turnos.controller.js'),
  'utf8'
);

// Preparar un entorno de pruebas sin modificar archivos reales
function setup(initial = []) {
  let turnos = structuredClone(initial);

  const fakeFs = {
    existsSync: () => true,
    readFileSync: () => JSON.stringify(turnos),
    writeFileSync: (_file, content) => {
      turnos = JSON.parse(content);
    }
  };

  const exports = {};

  const fakeRequire = (name) => {
    if (name === 'fs') return fakeFs;
    if (name === 'path') return path;

    if (name === '../services/profesionales.service') {
      return { getById: () => ({ id: 1 }) };
    }

    if (name === '../services/clientes.service') {
      return { getById: () => ({ id: 1 }) };
    }

    if (name === '../services/disponibilidad.service') {
      return class {
        getByProfesional() {
          return [{
            horaInicio: '09:00',
            horaFin: '18:00'
          }];
        }
      };
    }

    throw new Error(`Dependencia no prevista: ${name}`);
  };

  vm.runInNewContext(source, {
    exports,
    require: fakeRequire,
    __dirname: path.join(__dirname, '../controllers'),
    console
  });

  return {
    controller: exports,
    getTurnos: () => structuredClone(turnos)
  };
}

// Simular una respuesta HTTP de Express
function response() {
  return {
    statusCode: 200,
    body: undefined,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    }
  };
}

// Ejecutar una reserva
function reservar(controller, body) {
  const res = response();
  controller.crearTurno({ body }, res);
  return res;
}

const base = {
  profesionalId: 1,
  clienteId: 1,
  fecha: '2026-12-15',
  hora: '10:00'
};

// PRUEBA 1
test('Reserva válida: devuelve 201 y persiste estado reservado', () => {
  const { controller, getTurnos } = setup();

  const res = reservar(controller, base);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.turno.estado, 'reservado');
  assert.equal(getTurnos().length, 1);
});

// PRUEBA 2
test('Impide superposición del mismo profesional con otro cliente (409)', () => {
  const { controller } = setup([
    { id: 1, ...base, estado: 'reservado' }
  ]);

  const res = reservar(controller, {
    ...base,
    clienteId: 2
  });

  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /profesional/i);
});

// PRUEBA 3
test('Impide doble reserva del cliente con otro profesional (409)', () => {
  const { controller } = setup([
    { id: 1, ...base, estado: 'reservado' }
  ]);

  const res = reservar(controller, {
    ...base,
    profesionalId: 2
  });

  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /cliente/i);
});

// PRUEBA 4
test('Rechaza fecha imposible (400)', () => {
  const { controller } = setup();

  const res = reservar(controller, {
    ...base,
    fecha: '2026-02-30'
  });

  assert.equal(res.statusCode, 400);
});

// PRUEBA 5
test('Rechaza hora inválida (400)', () => {
  const { controller } = setup();

  const res = reservar(controller, {
    ...base,
    hora: '25:99'
  });

  assert.equal(res.statusCode, 400);
});

// PRUEBA 6
test('Cancela un turno conservando el registro', () => {
  const { controller, getTurnos } = setup([
    { id: 1, ...base, estado: 'reservado' }
  ]);

  const res = response();

  controller.cambiarEstado(
    {
      params: { id: '1' },
      body: { estado: 'cancelado' }
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(getTurnos().length, 1);
  assert.equal(getTurnos()[0].estado, 'cancelado');
});

// PRUEBA 7
test('Rechaza estado inexistente (400)', () => {
  const { controller } = setup([
    { id: 1, ...base, estado: 'reservado' }
  ]);

  const res = response();

  controller.cambiarEstado(
    {
      params: { id: '1' },
      body: { estado: 'pendiente' }
    },
    res
  );

  assert.equal(res.statusCode, 400);
});
