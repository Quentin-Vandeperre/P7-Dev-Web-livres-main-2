const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require('../middleware/multer');
const bookCtrl = require('../controllers/book');

router.get('/bestrating', bookCtrl.getThreeBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);

router.post('/:id/rating', auth, bookCtrl.rateBook, bookCtrl.getThreeBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;









// const express = require('express');
// const router = express.Router();

// const auth = require ('../middleware/auth');

// const bookCtrl = require('../controllers/book');

// // router.get('/bestrating', bookCtrl.getAllThings);
// router.get('/:id', bookCtrl.getOneThing);
// router.get('/', bookCtrl.getAllThings);
// //router.post('/', bookCtrl.createThing); // regarde ici pour faire fonctionner ta méthode
// router.post('/', (req, res) => { //mais regarde la avant pour comprendre comment ça fonctionne et pourquoi t'as une réponse dans postman 
//     let data = req.body;
//     res.send('Data Received: ' + JSON.stringify(data));
// })



// // router.post(':id/rating', auth, bookCtrl.createThing);
// router.post('/', auth, bookCtrl.createThing);
// // router.put(':id', auth, bookCtrl.modifyThing);
// // router.delete(':id', auth, bookCtrl.deleteThing);


// module.exports = router;