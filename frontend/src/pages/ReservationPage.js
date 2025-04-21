// frontend/src/pages/ReservationPage.js
import React from 'react';
import SeatPicker from '../components/SeatPicker'; // Ruta correcta de importación

const ReservationPage = () => {
  return (
    <div>
      <h2>Selecciona tus butacas</h2>
      <SeatPicker rows={8} cols={10} />
    </div>
  );
};

export default ReservationPage;