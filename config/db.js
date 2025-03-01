const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',  // ✅ Force IPv4 to avoid "::1" issue
    user: 'root',       
    password: '',       
    database: 'user_db', 
    port: 3307,  // ✅ Change MySQL port to 3307
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
