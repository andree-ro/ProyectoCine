import api from './api';

// Operaciones CRUD para salas de cine
export const createRoom = async (roomData) => {
  try {
    const response = await api.post('/cinema', roomData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al crear la sala'
    };
  }
};

export const updateRoomMovie = async (id, movieData) => {
  try {
    const response = await api.put(`/cinema/${id}/movie`, movieData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar información de película'
    };
  }
};

export const updateRoomCapacity = async (id, capacityData) => {
  try {
    const response = await api.put(`/cinema/${id}/capacity`, capacityData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar capacidad de sala'
    };
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await api.delete(`/cinema/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al eliminar la sala'
    };
  }
};

// Operaciones para gestión de usuarios
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener usuarios'
    };
  }
};

export const disableUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/disable`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al deshabilitar usuario'
    };
  }
};

export const enableUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/enable`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al habilitar usuario'
    };
  }
};