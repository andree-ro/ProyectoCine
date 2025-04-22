const pool = require('../config/db');

// Obtener todas las salas de cine
const getRooms = async (req, res) => {
  try {
    const [rooms] = await pool.query(
      'SELECT * FROM cinema_rooms'
    );
    
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener una sala de cine por ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rooms] = await pool.query(
      'SELECT * FROM cinema_rooms WHERE id = ?',
      [id]
    );
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    res.status(200).json(rooms[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear una nueva sala de cine
const createRoom = async (req, res) => {
  try {
    const { name, movie_title, movie_poster, fila, columna } = req.body;
    
    if (!name || !movie_title || !movie_poster || !fila || !columna) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO cinema_rooms (name, movie_title, movie_poster, fila, columna) VALUES (?, ?, ?, ?, ?)',
      [name, movie_title, movie_poster, fila, columna]
    );
    
    res.status(201).json({
      message: 'Sala creada exitosamente',
      roomId: result.insertId
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar datos de película de una sala
const updateMovieInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, movie_title, movie_poster } = req.body;
    
    if (!name || !movie_title || !movie_poster) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    const [result] = await pool.query(
      'UPDATE cinema_rooms SET name = ?, movie_title = ?, movie_poster = ? WHERE id = ?',
      [name, movie_title, movie_poster, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    res.status(200).json({ message: 'Información de película actualizada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar capacidad de una sala
const updateCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const { fila, columna } = req.body;
    
    if (!fila || !columna) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    // Verificar si hay reservaciones para esta sala
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE room_id = ?',
      [id]
    );
    
    if (reservations.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede modificar la capacidad porque la sala tiene reservaciones' 
      });
    }
    
    const [result] = await pool.query(
      'UPDATE cinema_rooms SET fila = ?, columna = ? WHERE id = ?',
      [fila, columna, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    res.status(200).json({ message: 'Capacidad de sala actualizada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar una sala de cine
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay reservaciones asociadas a la sala
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE room_id = ?',
      [id]
    );
    
    if (reservations.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar la sala porque tiene reservaciones asociadas' 
      });
    }
    
    const [result] = await pool.query(
      'DELETE FROM cinema_rooms WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    res.status(200).json({ message: 'Sala eliminada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateMovieInfo,
  updateCapacity,
  deleteRoom
};