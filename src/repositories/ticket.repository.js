const pool = require('../config/db');

async function findAll(prioridad) {
  if (prioridad) {
    const [rows] = await pool.query('SELECT * FROM tickets WHERE prioridad = ? ORDER BY id ASC', [prioridad]);
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM tickets ORDER BY id ASC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findByNumero(numero) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE numero = ?', [numero]);
  return rows[0] || null;
}

async function create({ numero, asunto, prioridad, estado, fecha }) {
  const [result] = await pool.query(
    'INSERT INTO tickets (numero, asunto, prioridad, estado, fecha) VALUES (?, ?, ?, ?, ?)',
    [numero, asunto, prioridad, estado, fecha]
  );
  return findById(result.insertId);
}

async function update(id, { numero, asunto, prioridad, estado, fecha }) {
  await pool.query(
    'UPDATE tickets SET numero = ?, asunto = ?, prioridad = ?, estado = ?, fecha = ? WHERE id = ?',
    [numero, asunto, prioridad, estado, fecha, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, findByNumero, create, update, remove };
