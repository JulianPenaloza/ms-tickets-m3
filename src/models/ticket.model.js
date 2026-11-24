const HttpError = require('../errors/HttpError');

const PRIORIDADES = ['baja', 'media', 'alta'];
const ESTADOS = ['abierto', 'cerrado'];
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validarTicket(body) {
  const { numero, asunto, prioridad, estado, fecha } = body || {};

  if (typeof numero !== 'string' || !numero.trim()) {
    throw new HttpError(400, 'El campo numero es obligatorio');
  }

  if (numero.trim().length > 50) {
    throw new HttpError(400, 'El numero no puede superar 50 caracteres');
  }

  if (typeof asunto !== 'string' || !asunto.trim()) {
    throw new HttpError(400, 'El campo asunto es obligatorio');
  }

  if (asunto.trim().length > 200) {
    throw new HttpError(400, 'El asunto no puede superar 200 caracteres');
  }

  if (!PRIORIDADES.includes(prioridad)) {
    throw new HttpError(400, 'La prioridad debe ser baja, media o alta');
  }

  if (!ESTADOS.includes(estado)) {
    throw new HttpError(400, 'El estado debe ser abierto o cerrado');
  }

  if (typeof fecha !== 'string' || !FECHA_REGEX.test(fecha)) {
    throw new HttpError(400, 'La fecha es obligatoria y debe tener formato AAAA-MM-DD');
  }

  const fechaValidada = new Date(`${fecha}T00:00:00.000Z`);

  if (
    Number.isNaN(fechaValidada.getTime()) ||
    fechaValidada.toISOString().slice(0, 10) !== fecha
  ) {
    throw new HttpError(400, 'La fecha indicada no es válida');
  }

  return {
    numero: numero.trim(),
    asunto: asunto.trim(),
    prioridad,
    estado,
    fecha
  };
}

function formatearTicket(row) {
  return {
    id: row.id,
    numero: row.numero,
    asunto: row.asunto,
    prioridad: row.prioridad,
    estado: row.estado,
    fecha: row.fecha instanceof Date
      ? row.fecha.toISOString().slice(0, 10)
      : String(row.fecha).slice(0, 10)
  };
}

module.exports = { PRIORIDADES, ESTADOS, validarTicket, formatearTicket };
