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
  const { id } = req.params;
  const { userId, rating} = req.body;

  Book.findById(id)
  .then(book => {
      if (!book) {
          return res.status(404).json({ error: 'Book not found' });
      }
      // On vérifie si l'utilisater a déjà mis une note
      for (let i = 0; i < book.ratings.length; i++) {
          if (book.ratings[i].userId === userId) {
              return res.status(400).json({ message: 'L utilisateur a déjà noté ce livre' });
          }
      }
      // On ajoute la note dans le tableau des notes du livre
      book.ratings.push({
          userId : userId, 
          grade : rating
      });
      // On calcue la nouvelle moyenne de notes
      let sum = 0;
      for (let i = 0; i < book.ratings.length; i++) 
      {
          sum += book.ratings[i].grade;
      }
      averageRating = sum / book.ratings.length;
      book.averageRating = parseInt(averageRating);
      // On met à jour les notes et la moyenne du livre
      return  Book.updateOne({ _id: req.params.id }, { ratings:book.ratings, averageRating:book.averageRating })
  .then(data=> {
      if(data){
      res.status(201).json(book)
      }
  })
  .catch(error => res.status(400).json({ error }))
  })
  .catch(error => res.status(400).json({ message:'il y a eu une erreur' }));
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
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (book.userId !== req.auth.userId) {
            res.status(403).json({ message: "Non autorisé à modifier ce livre." });
        } else {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(201).json({ message: "Le livre a été modifié avec succès !" }))
                .catch(error => res.status(400).json({ error }));
        }
    })
};


  exports.deleteBook = async (req, res, next ) => {
    try {
      const book = await Book.findOne({_id: req.params.id});
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'Not authorized'});
            } else {
              const filename = book.imageUrl.split('/images/')[1];       
                      fs.unlink(`images/${filename}`, () => {            // supprimer le livre de la base de donnée
                book.deleteOne()
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  // .catch(error => res.status(401).json({ error }));
                  .catch(error => {console.log( { error }) })
                      })
            }
        }
        catch(error) {
            res.status(400).json({ error });
        };
 }