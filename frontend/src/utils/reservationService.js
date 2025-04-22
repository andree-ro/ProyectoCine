import api from './api';

export const getReservationsByRoomAndDate = async (roomId, date) => {
  try {
    const response = await api.get(`/reservations/room/${roomId}/date/${date}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener reservaciones'
    };
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al crear reservación'
    };
  }
};

export const getUserReservations = async () => {
  try {
    const response = await api.get('/reservations/user');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener reservaciones del usuario'
    };
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    const response = await api.put(`/reservations/${id}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar estado de reservación'
    };
  }
};