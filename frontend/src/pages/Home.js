import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert
} from '@mui/material';
import CinemaRoomCard from '../components/cinema/CinemaRoomCard';
import { getAllRooms } from '../utils/cinemaService';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const result = await getAllRooms();
      
      if (result.success) {
        setRooms(result.data);
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Salas de Cine Disponibles
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {rooms.length === 0 && !error ? (
        <Alert severity="info">
          No hay salas de cine disponibles en este momento.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item key={room.id} xs={12} sm={6} md={4}>
              <CinemaRoomCard room={room} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;