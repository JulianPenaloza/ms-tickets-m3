const ticketService = require('../services/ticket.service');

async function listar(req, res, next) {
  try {
    const tickets = await ticketService.listar(
      req.query.prioridad,
      req.headers.authorization
    );
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const ticket = await ticketService.obtenerPorId(
      req.params.id,
      req.headers.authorization
    );
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const ticket = await ticketService.crear(
      req.body,
      req.headers.authorization
    );
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const ticket = await ticketService.actualizar(
      req.params.id,
      req.body,
      req.headers.authorization
    );
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    await ticketService.eliminar(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
