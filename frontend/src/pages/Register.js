import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
            console.log('Registro exitoso:', response.data);  // Muestra la respuesta en la consola
            alert('Usuario registrado exitosamente');  // Muestra un mensaje de éxito
            navigate('/login');  // Redirige al login después del registro
        } catch (error) {
            console.error('Error en el registro:', error);  // Muestra el error en la consola
            alert('Error en el registro. Inténtalo de nuevo.');  // Muestra un mensaje de error
        }
    };

    return (
        <Container>
            <Typography variant="h4">Register</Typography>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleRegister}>
                Register
            </Button>
        </Container>
    );
};

export default Register;