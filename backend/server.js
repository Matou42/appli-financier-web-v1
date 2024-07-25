const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { pool, sessionStore } = require('./config/db');
const authRoutes = require('./routes/api/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Remplacez vos identifiants Plaid ici
const PLAID_CLIENT_ID = '669d08c15e3c0b001a9ef2f6';  // Remplacez par votre identifiant client Plaid
const PLAID_SECRET = 'f1b4a345b66dd153d4b51ed95a81e1';        // Remplacez par votre secret Plaid
const PLAID_ENV = PlaidEnvironments.sandbox;     // Utilisez 'sandbox' ou 'development' ou 'production'

const configuration = new Configuration({
  basePath: PLAID_ENV,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});
const client = new PlaidApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'votre_cle_secrete_ici',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { secure: false }
}));
app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/create_link_token', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const configs = {
    user: {
      client_user_id: userId,
    },
    client_name: 'Your App Name',
    products: ['auth', 'transactions'],
    country_codes: ['US'],
    language: 'en',
  };

  try {
    const createTokenResponse = await client.linkTokenCreate(configs);
    res.json(createTokenResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating link token' });
  }
});

app.post('/get_access_token', async (req, res) => {
  const { public_token, userId } = req.body;

  if (!public_token || !userId) {
    return res.status(400).json({ error: 'public_token and userId are required' });
  }

  try {
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token,
    });
    const accessToken = tokenResponse.data.access_token;

    // Store accessToken in the database associated with the userId

    res.json({ access_token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while exchanging public token' });
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session && req.session.user) {
    res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
  } else {
    res.redirect('/login.html');
  }
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
