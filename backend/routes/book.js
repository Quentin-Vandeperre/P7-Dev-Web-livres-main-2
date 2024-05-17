const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth');

const bookCtrl = require('../controllers/book');

// router.get('/bestrating', bookCtrl.getAllThings);
router.get('/:id', bookCtrl.getOneThing);
router.get('/', bookCtrl.getAllThings);

// router.post(':id/rating', auth, bookCtrl.createThing);
// router.post('/', auth, bookCtrl.createThing);
// router.put(':id', auth, bookCtrl.modifyThing);
// router.delete(':id', auth, bookCtrl.deleteThing);


module.exports = router;