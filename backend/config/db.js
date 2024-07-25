const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise'); // Utilisation de mysql2/promise pour les promesses
const { Pool } = require('mysql2'); // Import du Pool depuis mysql2
const connexion = require('./connexion-db.js'); // Assurez-vous que le chemin est correct

// Création du pool de connexion MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'gestion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuration du store de session MySQL
const sessionStore = new MySQLStore({
  expiration: 120000, // Durée de validité en ms (par exemple, 1 jour)
  createDatabaseTable: true, // Création de la table si elle n'existe pas
  schema: {
    tableName: 'sessions', // Nom personnalisé de la table de sessions
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, pool);

// Configuration de l'application Express
const app = express();

// Middleware de session
app.use(session({
  key: 'session_cookie_name',
  secret: 'votre_secret', // Clé secrète pour signer la session
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
    maxAge: 120000 // Durée de validité du cookie en ms (par exemple, 1 jour)
}))

module.exports = { pool, sessionStore };
