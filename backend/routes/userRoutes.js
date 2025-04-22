const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  disableUser, 
  enableUser 
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Rutas protegidas (solo para administradores)
router.get('/', verifyToken, getAllUsers);
router.put('/:userId/disable', verifyToken, disableUser);
router.put('/:userId/enable', verifyToken, enableUser);

module.exports = router;