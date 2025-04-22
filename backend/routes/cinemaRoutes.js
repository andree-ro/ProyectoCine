const express = require('express');
const router = express.Router();
const { 
  getRooms, 
  getRoomById, 
  createRoom, 
  updateMovieInfo, 
  updateCapacity,
  deleteRoom
} = require('../controllers/cinemaController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Rutas protegidas (solo para administradores)
router.post('/', verifyToken, createRoom);
router.put('/:id/movie', verifyToken, updateMovieInfo);
router.put('/:id/capacity', verifyToken, updateCapacity);
router.delete('/:id', verifyToken, deleteRoom);

module.exports = router;
