const { text } = require('express');     // qu'est ce que le text ?
const Thing = require('../models/Thing');

exports.getAllThings = async (req, res, next) => {
  try {
    const books = await Thing.find();

    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(200).json({ message: 'No books available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

// exports.createThing = (req, res, next) => {
//     delete req.body._id;
//     const thing = new Thing({
//       ...req.body
//     });
//     thing.save()
//       .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//       .catch(error => res.status(400).json({ error }));
//   };

//   exports.modifyThing = (req, res, next) => {
//     Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//       .then(() => res.status(200).json({ message: 'Objet modifié !'}))
//       .catch(error => res.status(400).json({ error }));
//   };

//   exports.deleteThing = (req, res, next ) => {
//     Thing.findOne({_id: req.params.id})
//         .then((book) => {
//             if (book.userId != req.auth.userId) {
//                 res.status(401).json({ message : 'Not authorized'});
//             } else {
//                 const filename = book.imageUrl.split('/images/')[1];
//                fs.unlink(`images/${filename}`, () => {
//                    Thing.deleteOne({_id: req.params.id})
//                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
//                        .catch(error => res.status(401).json({ error }));
//                });
//             }
//         })
//         .catch((error) => {
//             res.status(400).json({ error });
//         });
//  }









  