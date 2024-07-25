// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    await User.create(name, email, password);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Après vérification des informations d'identification
    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.redirect('/dashboard.html'); // Rediriger vers dashboard.html après connexion réussie
    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
