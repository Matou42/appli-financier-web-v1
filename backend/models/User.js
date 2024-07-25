// backend/models/User.js
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'gestion',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const User = {
  async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
    const [rows, fields] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return rows.insertId;
  },

  async findByEmail(email) {
    const [rows, fields] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length ? rows[0] : null;
  }
};

module.exports = User;
