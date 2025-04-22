import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserReservations from './pages/UserReservations';
import ReservationPage from './pages/ReservationPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas - requieren autenticación */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/reservations" element={<UserReservations />} />
              <Route path="/reservation/:roomId" element={<ReservationPage />} />
            </Route>
            
            {/* Rutas de administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;