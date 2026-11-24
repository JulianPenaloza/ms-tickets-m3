const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const ticketRoutes = require('./routes/ticket.routes');
const HttpError = require('./errors/HttpError');

const app = express();
const PORT = process.env.PORT || 3011;
const HOST = process.env.HOST || '127.0.0.1';

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/tickets', ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, HOST, () => {
  console.log(`ms-tickets escuchando en http://${HOST}:${PORT}`);
});
