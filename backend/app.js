const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const cors = require ('cors');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect('mongodb+srv://Bestellar:Bestellar@cluster0.5sy2wdr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors())
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

module.exports = app;         // permet d'acceder à express dans les autres fichiers
