import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

// Para rutas que requieren autenticación
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Para rutas que requieren rol de administrador
export const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated && user?.role === 'admin' ? 
    <Outlet /> : 
    <Navigate to="/" />;
};