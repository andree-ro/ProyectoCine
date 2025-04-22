import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert
} from '@mui/material';

const PaymentModal = ({ open, onClose, onSubmit, selectedSeats, roomName, movieTitle, date }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al cambiar el valor
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }
    
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'El nombre del titular es requerido';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La fecha de expiración es requerida';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YY)';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'El código de seguridad es requerido';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Completar Reservación</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Estás reservando {selectedSeats.length} asiento(s) para:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Película:</strong> {movieTitle}<br />
          <strong>Sala:</strong> {roomName}<br />
          <strong>Fecha:</strong> {new Date(date).toLocaleDateString()}<br />
          <strong>Asientos:</strong> {selectedSeats.map(seat => `Fila ${seat.row}, Columna ${seat.column}`).join(' | ')}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número de Tarjeta"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              placeholder="1234567890123456"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Titular"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              error={!!errors.cardHolder}
              helperText={errors.cardHolder}
              placeholder="JUAN PEREZ"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fecha de Expiración"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              placeholder="MM/YY"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Código de Seguridad (CVV)"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              error={!!errors.cvv}
              helperText={errors.cvv}
              placeholder="123"
              type="password"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Confirmar Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;