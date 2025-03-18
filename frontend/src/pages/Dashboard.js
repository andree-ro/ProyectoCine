import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {
    return (
        <Container>
            <Typography variant="h4">Dashboard</Typography>
            <Typography variant="body1">Bienvenido al sistema de reservas de cine.</Typography>
        </Container>
    );
};

export default Dashboard;