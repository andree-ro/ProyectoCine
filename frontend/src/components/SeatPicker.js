// SeatPicker.js
import { useState } from 'react';
import { Box, Button } from '@mui/material';

const SeatPicker = ({ rows = 8, cols = 10 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (row, col) => {
    const seat = `${row}-${col}`;
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  return (
    <Box>
      {Array.from({ length: rows }).map((_, row) => (
        <Box key={row} display="flex" gap={1} mb={1}>
          {Array.from({ length: cols }).map((_, col) => (
            <Button
              key={col}
              variant="contained"
              color={
                selectedSeats.includes(`${row}-${col}`) ? 'primary' : 
                /* Lógica para butacas ocupadas */ 'success'
              }
              onClick={() => handleSeatClick(row, col)}
              sx={{ width: 30, height: 30, minWidth: 30 }}
            >
              {col + 1}
            </Button>
          ))}
        </Box>
      ))}
      <Button onClick={() => console.log('Butacas seleccionadas:', selectedSeats)}>
        Confirmar Reserva
      </Button>
    </Box>
  );
};