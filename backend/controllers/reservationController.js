const pool = require('../config/db');

// Obtener reservaciones por sala y fecha
const getReservationsByRoomAndDate = async (req, res) => {
  try {
    const { roomId, date } = req.params;
    
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE room_id = ? AND reservation_date = ?',
      [roomId, date]
    );
    
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear una nueva reservación
const createReservation = async (req, res) => {
  try {
    const { roomId, seats, date } = req.body;
    const userId = req.user.id; // Obtenido del token JWT
    
    if (!roomId || !seats || !date || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Datos de reservación incompletos' });
    }
    
    // Verificar que la sala existe
    const [rooms] = await pool.query(
      'SELECT * FROM cinema_rooms WHERE id = ?',
      [roomId]
    );
    
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }
    
    // Iniciar transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Verificar que los asientos no estén ya reservados
      for (const seat of seats) {
        const { row, column } = seat;
        
        const [existing] = await connection.query(
          'SELECT * FROM reservations WHERE room_id = ? AND seat_row = ? AND seat_column = ? AND reservation_date = ?',
          [roomId, row, column, date]
        );
        
        if (existing.length > 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ 
            message: `El asiento fila ${row}, columna ${column} ya está reservado` 
          });
        }
      }
      
      // Crear las reservaciones
      const reservationIds = [];
      
      for (const seat of seats) {
        const { row, column } = seat;
        
        const [result] = await connection.query(
          'INSERT INTO reservations (user_id, room_id, seat_row, seat_column, reservation_date) VALUES (?, ?, ?, ?, ?)',
          [userId, roomId, row, column, date]
        );
        
        reservationIds.push(result.insertId);
      }
      
      // Confirmar la transacción
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        message: 'Reservación creada exitosamente',
        reservationIds
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener reservaciones del usuario
const getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del token JWT
    
    const [reservations] = await pool.query(
      `SELECT r.id, r.seat_row, r.seat_column, r.reservation_date, 
              c.name as room_name, c.movie_title, c.movie_poster
       FROM reservations r
       INNER JOIN cinema_rooms c ON r.room_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date DESC`,
      [userId]
    );
    
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar estado de una reservación (cancelar)
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    if (!status || !['active', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Estado de reservación inválido' });
    }
    
    // Verificar si la reservación existe y pertenece al usuario
    const [reservations] = await pool.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }
    
    const reservation = reservations[0];
    
    // Solo el dueño de la reservación o un admin puede actualizarla
    if (reservation.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta reservación' });
    }
    
    // Actualizar la reservación
    const [result] = await pool.query(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.status(200).json({ message: 'Estado de reservación actualizado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getReservationsByRoomAndDate,
  createReservation,
  getUserReservations,
  updateReservationStatus
};