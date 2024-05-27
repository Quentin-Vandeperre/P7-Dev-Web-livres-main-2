const express = require('express');
const helmet = require('helmet')
const mongoose = require('mongoose');
const cors = require ('cors');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const app = express();
const path = require('path');

mongoose.connect('mongodb+srv://Bestellar:Bestellar@cluster0.5sy2wdr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));      // helmet aide à sécuriser les applications Express en définissant des en-têtes de réponse HTTP.
app.use(cors());         //CORS permet de spécifier quelles origines sont autorisées à accéder aux ressources sur le serveur
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

module.exports = app;         // permet d'acceder à express dans les autres fichiers
