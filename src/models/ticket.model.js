const HttpError = require('../errors/HttpError');

const PRIORIDADES = ['baja', 'media', 'alta'];
const ESTADOS = ['abierto', 'cerrado'];
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validarTicket(body) {
  const { numero, asunto, prioridad, estado, fecha } = body || {};

  if (!numero || typeof numero !== 'string' || !numero.trim()) {
    throw new HttpError(400, 'El campo numero es obligatorio');
  }
  if (!asunto || typeof asunto !== 'string' || !asunto.trim()) {
    throw new HttpError(400, 'El campo asunto es obligatorio');
  }
  if (!PRIORIDADES.includes(prioridad)) {
    throw new HttpError(400, 'La prioridad debe ser baja, media o alta');
  }
  if (!ESTADOS.includes(estado)) {
    throw new HttpError(400, 'El estado debe ser abierto o cerrado');
  }
  if (!fecha || typeof fecha !== 'string' || !FECHA_REGEX.test(fecha)) {
    throw new HttpError(400, 'La fecha es obligatoria y debe tener formato AAAA-MM-DD');
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
    fecha: row.fecha instanceof Date ? row.fecha.toISOString().slice(0, 10) : String(row.fecha).slice(0, 10)
  };
}

module.exports = { PRIORIDADES, ESTADOS, validarTicket, formatearTicket };
