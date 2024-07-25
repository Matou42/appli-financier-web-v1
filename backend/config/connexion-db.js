// Importation du module mysql2
const mysql = require('mysql2');

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost', // Votre hôte MySQL
  user: 'root', // Votre utilisateur MySQL
  database: 'gestion' // Nom de votre base de données MySQL
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});
