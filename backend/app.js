const express = require('express');   // framework
const helmet = require('helmet')      // helmet aide à sécuriser les applications Express en définissant des en-têtes de réponse HTTP.
const mongoose = require('mongoose');
const cors = require ('cors');        //CORS permet de spécifier quelles origines sont autorisées à accéder aux ressources sur le serveur
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const app = express();
const path = require('path');

require('dotenv').config();   // pour stocker les données sensible dans le fichier env et non dans le code source

mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));      
app.use(cors());         
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

module.exports = app;         // permet d'acceder à express dans les autres fichiers
