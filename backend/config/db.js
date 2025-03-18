const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',      // Dirección del servidor MySQL
    user: 'root',           // Usuario de MySQL
    password: 'andree2332',   // Contraseña de MySQL
    database: 'cine_db'     // Nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');  // Mensaje de confirmación
});

// Exportar la conexión para usarla en otros archivos
module.exports = connection;