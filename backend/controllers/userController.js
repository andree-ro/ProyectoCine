const pool = require('../config/db');

// Obtener todos los usuarios (solo para administradores)
const getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const [users] = await pool.query(
      'SELECT id, username, email, role, is_active, created_at FROM users'
    );
    
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Deshabilitar un usuario (dar de baja)
const disableUser = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const { userId } = req.params;
    
    // No permitir deshabilitar al propio usuario administrador
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'No puedes deshabilitar tu propia cuenta' });
    }
    
    const [result] = await pool.query(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ message: 'Usuario deshabilitado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Habilitar un usuario (reactivar)
const enableUser = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    const { userId } = req.params;
    
    const [result] = await pool.query(
      'UPDATE users SET is_active = TRUE WHERE id = ?',
      [userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ message: 'Usuario habilitado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllUsers,
  disableUser,
  enableUser
};
