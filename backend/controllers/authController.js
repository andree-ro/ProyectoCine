const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Se requiere usuario y contraseña' });
    }
    
    // Verificar si el usuario existe
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Crear token JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Usuario o email ya existe' });
    }
    
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertar nuevo usuario
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      userId: result.insertId 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, register };