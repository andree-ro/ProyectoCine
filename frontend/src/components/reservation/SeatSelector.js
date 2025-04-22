import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Button,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import WeekendIcon from '@mui/icons-material/Weekend';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

const SeatSelector = ({ room, date, reservedSeats, onSeatSelection }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMatrix, setSeatMatrix] = useState([]);
  
  // Crear matriz de asientos cuando cambia la sala o las reservaciones
  useEffect(() => {
    if (room) {
      const { fila, columna } = room;
      const matrix = [];
      
      // Crear matriz de asientos
      for (let i = 1; i <= fila; i++) {
        const row = [];
        for (let j = 1; j <= columna; j++) {
          // Verificar si el asiento está reservado
          const isReserved = reservedSeats.some(
            seat => seat.seat_row === i && seat.seat_column === j
          );
          
          row.push({
            row: i,
            column: j,
            status: isReserved ? 'reserved' : 'available'
          });
        }
        matrix.push(row);
      }
      
      setSeatMatrix(matrix);
    }
  }, [room, reservedSeats]);
  
  // Actualizar selección cuando cambia la fecha
  useEffect(() => {
    setSelectedSeats([]);
  }, [date]);
  
  const handleSeatClick = (rowIndex, colIndex) => {
    const seat = seatMatrix[rowIndex][colIndex];
    
    // No hacer nada si el asiento está reservado
    if (seat.status === 'reserved') return;
    
    const newMatrix = [...seatMatrix];
    const seatKey = `${seat.row}-${seat.column}`;
    const isSeatSelected = selectedSeats.some(
      s => s.row === seat.row && s.column === seat.column
    );
    
    if (isSeatSelected) {
      // Deseleccionar asiento
      setSelectedSeats(selectedSeats.filter(
        s => !(s.row === seat.row && s.column === seat.column)
      ));
      newMatrix[rowIndex][colIndex].status = 'available';
    } else {
      // Seleccionar asiento
      setSelectedSeats([...selectedSeats, { row: seat.row, column: seat.column }]);
      newMatrix[rowIndex][colIndex].status = 'selected';
    }
    
    setSeatMatrix(newMatrix);
    
    // Notificar al componente padre de la selección
    onSeatSelection(isSeatSelected ? 
      selectedSeats.filter(s => !(s.row === seat.row && s.column === seat.column)) : 
      [...selectedSeats, { row: seat.row, column: seat.column }]
    );
  };
  
  const getSeatColor = (status) => {
    switch (status) {
      case 'available':
        return '#90caf9'; // Azul claro
      case 'selected':
        return '#4caf50'; // Verde
      case 'reserved':
        return '#f44336'; // Rojo
      default:
        return '#90caf9';
    }
  };
  
  const getSeatIcon = (status) => {
    switch (status) {
      case 'reserved':
        return <DoNotDisturbAltIcon />;
      default:
        return <WeekendIcon />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        Selección de Asientos - {room?.name}
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom align="center">
        Película: {room?.movie_title}
      </Typography>
      
      <Typography variant="subtitle2" gutterBottom align="center">
        Fecha: {new Date(date).toLocaleDateString()}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexDirection: 'column', 
          alignItems: 'center',
          mt: 3
        }}
      >
        {/* Pantalla */}
        <Paper 
          elevation={1} 
          sx={{ 
            width: '80%', 
            py: 1, 
            bgcolor: '#e0e0e0', 
            textAlign: 'center',
            mb: 4,
            borderRadius: '50% / 20%'
          }}
        >
          <Typography variant="subtitle1">PANTALLA</Typography>
        </Paper>
        
        {/* Matriz de asientos */}
        <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Grid container spacing={1} justifyContent="center">
            {seatMatrix.map((row, rowIndex) => (
              <Grid container item key={rowIndex} spacing={1} justifyContent="center">
                {row.map((seat, colIndex) => (
                  <Grid item key={`${rowIndex}-${colIndex}`}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '40px',
                        height: '40px',
                        bgcolor: getSeatColor(seat.status),
                        '&:hover': {
                          bgcolor: seat.status === 'reserved' ? 
                            getSeatColor('reserved') : 
                            '#64b5f6' // Hover azul para disponibles y seleccionados
                        },
                        m: 0.2
                      }}
                      disabled={seat.status === 'reserved'}
                      onClick={() => handleSeatClick(rowIndex, colIndex)}
                    >
                      {getSeatIcon(seat.status)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Leyenda */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
          <Chip 
            icon={<WeekendIcon />} 
            label="Disponible" 
            sx={{ bgcolor: '#90caf9' }}
          />
          <Chip 
            icon={<WeekendIcon />} 
            label="Seleccionado" 
            sx={{ bgcolor: '#4caf50', color: 'white' }}
          />
          <Chip 
            icon={<DoNotDisturbAltIcon />} 
            label="Reservado" 
            sx={{ bgcolor: '#f44336', color: 'white' }}
          />
        </Box>
        
        {/* Resumen de selección */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Asientos seleccionados: {selectedSeats.length}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedSeats.map((seat, index) => (
              <Chip 
                key={index} 
                label={`Fila ${seat.row}, Columna ${seat.column}`} 
                color="success" 
                onDelete={() => handleSeatClick(seat.row - 1, seat.column - 1)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SeatSelector;