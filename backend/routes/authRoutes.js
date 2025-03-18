const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el login
router.post('/login', authController.login);

// Ruta para el registro
router.post('/register', authController.register);

module.exports = router;