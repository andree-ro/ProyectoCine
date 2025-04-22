const express = require('express');
const router = express.Router();
const { 
  getReservationsByRoomAndDate, 
  createReservation, 
  getUserReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/auth');

// Rutas protegidas (requieren autenticación)
router.get('/room/:roomId/date/:date', verifyToken, getReservationsByRoomAndDate);
router.post('/', verifyToken, createReservation);
router.get('/user', verifyToken, getUserReservations);
router.put('/:id/status', verifyToken, updateReservationStatus);

module.exports = router;