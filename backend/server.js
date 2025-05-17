// Importaciones
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

// Inicializar app Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Log de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  console.log('Solicitud recibida en la ruta raíz');
  res.send('API del sistema de reservación de cine está funcionando');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cinema', cinemaRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});