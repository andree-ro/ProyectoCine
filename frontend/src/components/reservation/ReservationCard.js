import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Button,
    CardActions
  } from '@mui/material';
  import { format } from 'date-fns';
  import { es } from 'date-fns/locale';
  
  const ReservationCard = ({ reservation, onCancel }) => {
    const isActive = reservation.status !== 'cancelled';
    const formattedDate = format(new Date(reservation.reservation_date), 'EEEE d MMMM yyyy', { locale: es });
    
    return (
      <Card sx={{ display: 'flex', mb: 2, opacity: isActive ? 1 : 0.7 }}>
        <CardMedia
          component="img"
          sx={{ width: 120 }}
          image={reservation.movie_poster || 'https://via.placeholder.com/120x180?text=No+Poster'}
          alt={reservation.movie_title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              {reservation.movie_title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Sala: {reservation.room_name}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Fecha: {formattedDate}
            </Typography>
            <Typography variant="body2">
              Asiento: Fila {reservation.seat_row}, Columna {reservation.seat_column}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={isActive ? 'Activa' : 'Cancelada'} 
                color={isActive ? 'success' : 'error'} 
                size="small" 
              />
            </Box>
          </CardContent>
          {isActive && (
            <CardActions>
              <Button 
                size="small" 
                color="error" 
                onClick={() => onCancel(reservation.id)}
              >
                Cancelar Reservación
              </Button>
            </CardActions>
          )}
        </Box>
      </Card>
    );
  };
  
  export default ReservationCard;