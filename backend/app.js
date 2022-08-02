const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Package permettant de faciliter les interactions entre Express et la bdd MongoDB
const helmet = require('helmet'); // Package permettant la sécurisation des en-têtes http: // npm i helmet --save
const bodyParser = require('body-parser');
const path = require('path');

// Variable d'environnement
// Exportation et protection des données secrètes vers le fichier .env
require('dotenv').config();

// Utilisation des modèles
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Préventions contre les attaques XSS (faille de sécurité qui permet à un attaquant d'injecter dans un site web un code client malveillant)
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Paramétrage des en-têtes pour éviter les erreurs de CORS (système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents)
// app.use(): permet d'attribuer un middleware à une route spécifique de l'application
app.use((req, res, next) => {

  // Permet l'accès à notre API depuis n'importe quelle origine "*"
  res.setHeader('Access-Control-Allow-Origin', '*')
  // Permet l'ajout des en-têtes mentionnés aux requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  // Permet l'envoi des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// Récupération des requêtes du body au format JSON
app.use(bodyParser.json());

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Export
module.exports = app;