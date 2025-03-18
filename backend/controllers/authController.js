const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

// Función para el login
const login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

// Función para el registro
const register = (req, res) => {
    const { username, password } = req.body;

    // Verifica que el nombre de usuario y la contraseña estén presentes
    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son obligatorios' });
    }

    // Verifica si el usuario ya existe
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashea la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Inserta el nuevo usuario en la base de datos
        const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, hashedPassword, 'client'], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error en la base de datos' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    });
};

// Exporta ambas funciones
module.exports = { login, register };