import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import SeatSelector from '../components/reservation/SeatSelector';
import PaymentModal from '../components/reservation/PaymentModal';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getRoomById } from '../utils/cinemaService';
import { getReservationsByRoomAndDate, createReservation } from '../utils/reservationService';

const ReservationPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  
  // Obtener datos de la sala
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      const result = await getRoomById(roomId);
      
      if (result.success) {
        setRoom(result.data);
        
        // Generar fechas disponibles (próximos 8 días)
        const dateOptions = [];
        const today = new Date();
        
        for (let i = 1; i <= 8; i++) {
          const date = addDays(today, i);
          const formattedDate = format(date, 'yyyy-MM-dd');
          const displayDate = format(date, 'EEEE d MMMM', { locale: es });
          
          dateOptions.push({
            value: formattedDate,
            display: displayDate.charAt(0).toUpperCase() + displayDate.slice(1)
          });
        }
        
        setDates(dateOptions);
        setSelectedDate(dateOptions[0].value); // Seleccionar la primera fecha por defecto
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    };
    
    fetchRoomData();
  }, [roomId]);
  
  // Obtener reservaciones para la fecha seleccionada
  useEffect(() => {
    const fetchReservations = async () => {
      if (selectedDate && roomId) {
        const result = await getReservationsByRoomAndDate(roomId, selectedDate);
        
        if (result.success) {
          setReservedSeats(result.data);
        } else {
          setError(result.message);
        }
      }
    };
    
    fetchReservations();
  }, [selectedDate, roomId]);
  
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSeats([]);
  };
  
  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };
  
  const handleOpenPaymentModal = () => {
    if (selectedSeats.length === 0) {
      setError('Por favor selecciona al menos un asiento');
      return;
    }
    
    setPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
  };
  
  const handleConfirmPayment = async () => {
    try {
      const result = await createReservation({
        roomId: parseInt(roomId),
        seats: selectedSeats,
        date: selectedDate
      });
      
      if (result.success) {
        setReservationComplete(true);
        setPaymentModalOpen(false);
        
        // Preparar datos para el QR
        const qrData = {
          roomName: room.name,
          movieTitle: room.movie_title,
          date: selectedDate,
          seats: selectedSeats.map(seat => `R${seat.row}C${seat.column}`).join(','),
          reservationIds: result.data.reservationIds
        };
        
        setReservationData(qrData);
      } else {
        setError(result.message);
        setPaymentModalOpen(false);
      }
    } catch (err) {
      setError('Error al procesar la reservación');
      setPaymentModalOpen(false);
    }
  };
  
  const handleDownloadQR = () => {
    const canvas = document.getElementById('reservation-qr');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `reservacion-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {!reservationComplete ? (
        <>
          <Typography variant="h4" gutterBottom>
            Reserva de Asientos
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {room && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <img 
                      src={room.movie_poster} 
                      alt={room.movie_title}
                      style={{ width: '100%', maxWidth: '200px', borderRadius: '8px' }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h5">{room.movie_title}</Typography>
                      <Typography variant="subtitle1">Sala: {room.name}</Typography>
                      <Typography variant="body2">
                        Capacidad: {room.fila * room.columna} asientos
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="date-select-label">Selecciona Fecha</InputLabel>
                    <Select
                      labelId="date-select-label"
                      value={selectedDate}
                      label="Selecciona Fecha"
                      onChange={handleDateChange}
                    >
                      {dates.map((date, index) => (
                        <MenuItem key={index} value={date.value}>
                          {date.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <SeatSelector 
                room={room}
                date={selectedDate}
                reservedSeats={reservedSeats}
                onSeatSelection={handleSeatSelection}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleOpenPaymentModal}
                  disabled={selectedSeats.length === 0}
                >
                  Continuar con el Pago
                </Button>
              </Box>
              
              <PaymentModal 
                open={paymentModalOpen}
                onClose={handleClosePaymentModal}
                onSubmit={handleConfirmPayment}
                selectedSeats={selectedSeats}
                roomName={room.name}
                movieTitle={room.movie_title}
                date={selectedDate}
              />
            </>
          )}
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
            ¡Reservación completada exitosamente!
          </Alert>
          
          <Typography variant="h5" gutterBottom>
            Detalles de tu Reservación
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="body1">
              <strong>Película:</strong> {room?.movie_title}
            </Typography>
            <Typography variant="body1">
              <strong>Sala:</strong> {room?.name}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Asientos:</strong> {selectedSeats.map(seat => `Fila ${seat.row}, Columna ${seat.column}`).join(' | ')}
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Escanea este código QR para acceder a la sala:
          </Typography>
          
          <Box sx={{ mt: 2, mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <QRCode 
              id="reservation-qr"
              value={JSON.stringify(reservationData)}
              size={200}
              level="H"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownloadQR}
            >
              Descargar QR
            </Button>
            <Button 
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ReservationPage;