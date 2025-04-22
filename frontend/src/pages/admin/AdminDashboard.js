import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import RoomForm from '../../components/admin/RoomForm';
import RoomsTable from '../../components/admin/RoomsTable';
import { getAllRooms } from '../../utils/cinemaService';
import { createRoom, updateRoomMovie, updateRoomCapacity, deleteRoom } from '../../utils/adminService';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Cargar salas al montar el componente
  useEffect(() => {
    fetchRooms();
  }, []);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Resetear el modo de edición al cambiar de tab
    if (newValue === 0) {
      setEditMode(false);
      setSelectedRoom(null);
    }
  };

  const handleCreateRoom = async (roomData) => {
    const result = await createRoom(roomData);
    
    if (result.success) {
      setSuccess('Sala creada exitosamente');
      fetchRooms(); // Recargar las salas
      return { success: true };
    } else {
      setError(result.message);
      return { success: false, message: result.message };
    }
  };

  const handleUpdateRoom = async (roomData) => {
    if (!selectedRoom) return { success: false, message: 'No hay sala seleccionada' };
    
    // Si se modificó la capacidad, llamamos a updateRoomCapacity
    // de lo contrario, solo actualizamos la información de la película
    if (roomData.fila !== selectedRoom.fila || roomData.columna !== selectedRoom.columna) {
      const capacityResult = await updateRoomCapacity(selectedRoom.id, {
        fila: roomData.fila,
        columna: roomData.columna
      });
      
      if (!capacityResult.success) {
        return { success: false, message: capacityResult.message };
      }
    }
    
    // Actualizar información de película
    const movieResult = await updateRoomMovie(selectedRoom.id, {
      name: roomData.name,
      movie_title: roomData.movie_title,
      movie_poster: roomData.movie_poster
    });
    
    if (movieResult.success) {
      setSuccess('Sala actualizada exitosamente');
      fetchRooms(); // Recargar las salas
      return { success: true };
    } else {
      setError(movieResult.message);
      return { success: false, message: movieResult.message };
    }
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditMode(true);
    setTabValue(0); // Cambiar a la pestaña del formulario
  };

  const handleDeleteRoom = async (roomId) => {
    const result = await deleteRoom(roomId);
    
    if (result.success) {
      setSuccess('Sala eliminada exitosamente');
      fetchRooms(); // Recargar las salas
    } else {
      setError(result.message);
    }
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

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
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
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={editMode ? "Editar Sala" : "Crear Sala"} />
          <Tab label="Gestionar Salas" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <RoomForm 
            room={selectedRoom}
            onSubmit={editMode ? handleUpdateRoom : handleCreateRoom}
            mode={editMode ? 'edit' : 'create'}
          />
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <RoomsTable 
              rooms={rooms}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              loading={loading}
            />
          )
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;