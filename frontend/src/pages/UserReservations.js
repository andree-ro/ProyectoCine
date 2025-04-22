import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import ReservationCard from '../components/reservation/ReservationCard';
import { getUserReservations, updateReservationStatus } from '../utils/reservationService';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const result = await getUserReservations();
    
    if (result.success) {
      setReservations(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCancelClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservationId) return;
    
    const result = await updateReservationStatus(selectedReservationId, 'cancelled');
    
    if (result.success) {
      setSuccess('Reservación cancelada exitosamente');
      fetchReservations(); // Recargar las reservaciones
    } else {
      setError(result.message);
    }
    
    setCancelDialogOpen(false);
    setSelectedReservationId(null);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedReservationId(null);
  };

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Agrupar reservaciones por fecha
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const date = reservation.reservation_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reservation);
    return acc;
  }, {});

  // Ordenar fechas de más reciente a más antigua
  const sortedDates = Object.keys(groupedReservations).sort((a, b) => new Date(b) - new Date(a));

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Reservaciones
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {reservations.length === 0 ? (
        <Alert severity="info">
          No tienes reservaciones. ¡Reserva asientos para tu película favorita!
        </Alert>
      ) : (
        <Box>
          {sortedDates.map(date => (
            <Box key={date} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {new Date(date).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {groupedReservations[date].map(reservation => (
                <ReservationCard 
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancelClick}
                />
              ))}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Diálogo de confirmación para cancelar */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Confirmar cancelación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas cancelar esta reservación? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>
            No, mantener reservación
          </Button>
          <Button onClick={handleCancelConfirm} color="error">
            Sí, cancelar reservación
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserReservations;