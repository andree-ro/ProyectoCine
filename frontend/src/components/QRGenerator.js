// QRGenerator.js
import QRCode from 'qrcode.react';

const QRGenerator = ({ reservationId }) => (
  <div>
    <QRCode value={`ReservaID:${reservationId}`} size={128} />
    <p>Escanea este código para ver los detalles de tu reserva.</p>
  </div>
);