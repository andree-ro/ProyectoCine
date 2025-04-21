// reservationsController.js
const db = require('../config/db');

const createReservation = (req, res) => {
  const { userId, roomId, seats, date } = req.body;
  const query = 'INSERT INTO reservations (user_id, room_id, seat_number, date) VALUES ?';
  
  const values = seats.map(seat => [userId, roomId, seat, date]);
  
  db.query(query, [values], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al guardar la reserva' });
    res.json({ success: true, reservationId: result.insertId });
  });
};