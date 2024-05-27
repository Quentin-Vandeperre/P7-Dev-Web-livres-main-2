const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    
    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(200).json({ message: 'No books available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getThreeBooks = async (req, res, next) => {
  try {

    const topBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    
    if (topBooks.length > 0) {
      res.status(200).json(topBooks);
    } else {
      res.status(200).json({ message: 'No books available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.rateBook = async (req, res, next) => {
  try {
    

    // Rechercher le livre à noter
    const book = await Book.findOne({_id: req.params.id});
    const {  userId, rating } = req.body;                 // rating comme dans le front

    for (i=0 ; i<book.ratings.length; i++){
      if (book.ratings[i].userId == req.auth.userId) {
        return res.status(400).json({ message : 'Vous avez déja noté ce livre'});
      }
    }

    book.ratings.push({
      userId : userId, 
      grade : rating,
  });
    console.log(book.ratings)

    //Calcul moyenne du livre 
    let somme = 0;

    for (i=0 ; i<book.ratings.length; i++){
      somme += book.ratings[i].grade
    }

    book.averageRating = parseInt(somme/book.ratings.length);

    // Enregistrer les modifications dans la base de données
    book.updateOne({ _id: req.params.id }, { ratings:book.ratings, averageRating:book.averageRating })  
    .then(() => { res.status(201).json({ message: 'Note enregistré !' }) })
    .catch(error => {console.log( { error }) })
  //  .catch(error => res.status(401).json({ error }));
  }
   catch(error) {
    // res.status(400).json({ error });
      console.log( { error });
 };
  
};

exports.createBook = (req, res, next) => {
  const { title, author, year, genre, ratings, averageRating } = JSON.parse(req.body.book);
  const userId = req.auth.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  const book = new Book({
    title,
    author,
    year,
    genre,
    ratings,
    averageRating,
    imageUrl,
    userId
  });
    // Enregistrement dans la base de données
    book.save()
    
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json( { error }) })
        // .catch(error => {console.log( { error }) })
};

  exports.modifyBook = async (req, res, next) => {
    try {
      
      const { title, author, year, genre } = JSON.parse(req.body.book);
      
      const book = await Book.findOne({_id: req.params.id});
      const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                  if (book.userId != req.auth.userId) {
                      res.status(401).json({ message : 'Not authorized'});
                  } else {

                    const filename = book.imageUrl.split('/images/')[1];
                      fs.unlink(`images/${filename}`, () => {  
                               
                      })
                      book.imageUrl = imageUrl;
                      book.title = title;
                      book.author = author;
                      book.year = year;
                      book.genre = genre;

                      book.updateOne({ _id: req.params.id }, { ...Book, _id: req.params.id })   //...Book ca va boucler tous les champs du tableau
                     .then(() => { res.status(200).json({message: 'Objet remplacé !'})})
                     .catch(error => {console.log( { error }) });
                    // .catch(error => res.status(401).json({ error })); 
                  };
              }
              catch(error) {
                //  res.status(400).json({ error });
                   console.log( { error });
              };
    
  };


  exports.deleteBook = async (req, res, next ) => {
    try {
      const book = await Book.findOne({_id: req.params.id});
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
              const filename = book.imageUrl.split('/images/')[1];       
                      fs.unlink(`images/${filename}`, () => {            // supprimer le livre de la base de donnée
                book.deleteOne()
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
                      })
            }
        }
        catch(error) {
            res.status(400).json({ error });
        };
 }

