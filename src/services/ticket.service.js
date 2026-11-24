const HttpError = require('../errors/HttpError');
const { PRIORIDADES, validarTicket, formatearTicket } = require('../models/ticket.model');
const ticketRepository = require('../repositories/ticket.repository');

async function listar(prioridad) {
  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    throw new HttpError(400, 'El filtro prioridad debe ser baja, media o alta');
  }
  const rows = await ticketRepository.findAll(prioridad);
  return rows.map(formatearTicket);
}

async function obtenerPorId(id) {
  const ticket = await ticketRepository.findById(id);
  if (!ticket) {
    throw new HttpError(404, 'Ticket no encontrado');
  }
  return formatearTicket(ticket);
}

async function crear(body) {
  const datos = validarTicket(body);
  const existente = await ticketRepository.findByNumero(datos.numero);
  if (existente) {
    throw new HttpError(409, `Ya existe un ticket con el numero ${datos.numero}`);
  }
  const creado = await ticketRepository.create(datos);
  return formatearTicket(creado);
}

async function actualizar(id, body) {
  const actual = await ticketRepository.findById(id);
  if (!actual) {
    throw new HttpError(404, 'Ticket no encontrado');
  }
  const datos = validarTicket(body);
  const conMismoNumero = await ticketRepository.findByNumero(datos.numero);
  if (conMismoNumero && conMismoNumero.id !== Number(id)) {
    throw new HttpError(409, `Ya existe un ticket con el numero ${datos.numero}`);
  }
  const actualizado = await ticketRepository.update(id, datos);
  return formatearTicket(actualizado);
}

async function eliminar(id) {
  const eliminado = await ticketRepository.remove(id);
  if (!eliminado) {
    throw new HttpError(404, 'Ticket no encontrado');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
