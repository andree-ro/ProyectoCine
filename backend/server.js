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

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del sistema de reservación de cine está funcionando');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cinema', cinemaRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});