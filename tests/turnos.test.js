//PRUEBAS AUTOMATICAS
import test from "node:test";
import assert from "node:assert/strict";
import { obtenerTurnos } from "../controllers/turnos.controller.js";

function crearRespuesta() {
  return {
    statusCode: 200,
    body: null,
    status(codigo) {
      this.statusCode = codigo;
      return this;
    },
    json(datos) {
      this.body = datos;
      return this;
    }
  };
}

function consultar(query) {
  const res = crearRespuesta();
  obtenerTurnos({ query }, res);
  return res;
}

test("Rechaza una fecha imposible", () => {
  const res = consultar({ fecha: "2026-02-30" });
  assert.equal(res.statusCode, 400);
});

test("Rechaza un estado inexistente", () => {
  const res = consultar({ estado: "pendiente" });
  assert.equal(res.statusCode, 400);
});

test("Rechaza un ID de profesional no entero", () => {
  const res = consultar({ profesionalId: "abc" });
  assert.equal(res.statusCode, 400);
});

test("Rechaza un ID de cliente no entero", () => {
  const res = consultar({ clienteId: "1.5" });
  assert.equal(res.statusCode, 400);
});

test("Acepta una consulta con filtros válidos", () => {
  const res = consultar({
    estado: "reservado",
    fecha: "2026-10-15"
  });

  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
});
