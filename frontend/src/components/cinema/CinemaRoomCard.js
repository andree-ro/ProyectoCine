import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Button, 
    CardActions,
    Box
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  
  const CinemaRoomCard = ({ room }) => {
    const navigate = useNavigate();
  
    return (
      <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={room.movie_poster || 'https://via.placeholder.com/300x200?text=Poster+no+disponible'}
          alt={room.movie_title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {room.movie_title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sala: {room.name}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Capacidad: {room.fila * room.columna} asientos
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            color="primary" 
            fullWidth
            variant="contained"
            onClick={() => navigate(`/reservation/${room.id}`)}
          >
            Reservar Asientos
          </Button>
        </CardActions>
      </Card>
    );
  };
  
  export default CinemaRoomCard;