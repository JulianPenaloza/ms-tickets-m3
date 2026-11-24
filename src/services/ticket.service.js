const HttpError = require('../errors/HttpError');
const { PRIORIDADES, validarTicket, formatearTicket } = require('../models/ticket.model');
const ticketRepository = require('../repositories/ticket.repository');
const areasClient = require('../clients/areas.client');

function extraerArea(respuesta) {
  if (!respuesta) return null;
  return respuesta.area || respuesta.data || respuesta;
}

function extraerAreas(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.areas)) return respuesta.areas;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  return [];
}

async function validarArea(areaId, authorization) {
  let respuesta;

  try {
    respuesta = await areasClient.obtenerPorId(areaId, authorization);
  } catch (error) {
    throw new HttpError(503, 'No fue posible consultar ms-areas');
  }

  const area = extraerArea(respuesta);

  if (!area || Number(area.id) !== areaId) {
    throw new HttpError(400, `El área ${areaId} no existe`);
  }

  return area;
}

function validarReglaPrioridad(datos, area) {
  if (
    datos.prioridad === 'alta' &&
    Number(area.max_tickets_alta) === 0
  ) {
    throw new HttpError(
      409,
      'El área seleccionada no permite tickets de prioridad alta'
    );
  }
}

function componerTicket(ticket, area) {
  return {
    ...formatearTicket(ticket),
    area: area
      ? {
          id: area.id,
          nombre_area: area.nombre_area,
          piso: area.piso
        }
      : null
  };
}

async function listar(prioridad, authorization) {
  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    throw new HttpError(400, 'El filtro prioridad debe ser baja, media o alta');
  }

  const rows = await ticketRepository.findAll(prioridad);
  const tickets = rows.map(formatearTicket);
  const ids = tickets.map(ticket => ticket.area_id);

  if (!ids.length) return [];

  try {
    const respuesta = await areasClient.obtenerPorIds(ids, authorization);
    const areas = extraerAreas(respuesta);
    const areasPorId = new Map(areas.map(area => [Number(area.id), area]));

    return rows.map(ticket =>
      componerTicket(ticket, areasPorId.get(Number(ticket.area_id)) || null)
    );
  } catch (error) {
    return rows.map(ticket => ({
      ...formatearTicket(ticket),
      area: null,
      aviso: 'No fue posible consultar los datos de las áreas'
    }));
  }
}

async function obtenerPorId(id, authorization) {
  const ticket = await ticketRepository.findById(id);

  if (!ticket) {
    throw new HttpError(404, 'Ticket no encontrado');
  }

  const area = await validarArea(Number(ticket.area_id), authorization);
  return componerTicket(ticket, area);
}

async function crear(body, authorization) {
  const datos = validarTicket(body);
  const area = await validarArea(datos.area_id, authorization);

  validarReglaPrioridad(datos, area);

  const existente = await ticketRepository.findByNumero(datos.numero);

  if (existente) {
    throw new HttpError(409, `Ya existe un ticket con el numero ${datos.numero}`);
  }

  const creado = await ticketRepository.create(datos);
  return componerTicket(creado, area);
}

async function actualizar(id, body, authorization) {
  const actual = await ticketRepository.findById(id);

  if (!actual) {
    throw new HttpError(404, 'Ticket no encontrado');
  }

  const datos = validarTicket(body);
  const area = await validarArea(datos.area_id, authorization);

  validarReglaPrioridad(datos, area);

  const conMismoNumero = await ticketRepository.findByNumero(datos.numero);

  if (conMismoNumero && conMismoNumero.id !== Number(id)) {
    throw new HttpError(409, `Ya existe un ticket con el numero ${datos.numero}`);
  }

  const actualizado = await ticketRepository.update(id, datos);
  return componerTicket(actualizado, area);
}

async function eliminar(id) {
  const eliminado = await ticketRepository.remove(id);

  if (!eliminado) {
    throw new HttpError(404, 'Ticket no encontrado');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
