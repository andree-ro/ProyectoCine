import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid,
  Paper,
  Alert,
  InputAdornment
} from '@mui/material';

const RoomForm = ({ room, onSubmit, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    movie_title: '',
    movie_poster: '',
    fila: 0,
    columna: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (room && mode === 'edit') {
      setFormData({
        name: room.name || '',
        movie_title: room.movie_title || '',
        movie_poster: room.movie_poster || '',
        fila: room.fila || 0,
        columna: room.columna || 0
      });
    }
  }, [room, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convertir a número para los campos fila y columna
    if (name === 'fila' || name === 'columna') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validaciones básicas
    if (!formData.name || !formData.movie_title || !formData.movie_poster) {
      setError('Todos los campos son requeridos');
      return;
    }
    
    if (formData.fila <= 0 || formData.columna <= 0) {
      setError('Las filas y columnas deben ser números positivos');
      return;
    }
    
    // Llamar a la función onSubmit pasada como prop
    const result = await onSubmit(formData);
    
    if (result.success) {
      setSuccess(mode === 'create' ? 'Sala creada exitosamente' : 'Sala actualizada exitosamente');
      
      // Si es creación, limpiar el formulario
      if (mode === 'create') {
        setFormData({
          name: '',
          movie_title: '',
          movie_poster: '',
          fila: 0,
          columna: 0
        });
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {mode === 'create' ? 'Crear Nueva Sala' : 'Editar Sala'}
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
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nombre de la Sala"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Título de la Película"
              name="movie_title"
              value={formData.movie_title}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="URL del Póster"
              name="movie_poster"
              value={formData.movie_poster}
              onChange={handleChange}
              margin="normal"
              placeholder="https://ejemplo.com/poster.jpg"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Número de Filas"
              name="fila"
              type="number"
              value={formData.fila}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Número de Columnas"
              name="columna"
              type="number"
              value={formData.columna}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 1 }}
              InputProps={{
                endAdornment: mode === 'edit' && (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="error">
                      * Solo se puede cambiar si no hay reservaciones
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {mode === 'create' ? 'Crear Sala' : 'Actualizar Sala'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoomForm;