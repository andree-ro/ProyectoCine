import api from './api';

export const getAllRooms = async () => {
  try {
    const response = await api.get('/cinema');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener las salas'
    };
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/cinema/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener la sala'
    };
  }
};