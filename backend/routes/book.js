const express = require('express');
const auth = require ('../middleware/auth');
const router = express.Router();

const stuffCtrl = require('../controllers/book');

router.get('/bestrating', stuffCtrl.getAllStuff);
router.get('/:id', stuffCtrl.getAllStuff);
router.get('/', stuffCtrl.getAllStuff);
router.post(':id/rating', auth, stuffCtrl.createThing);
router.post('/', auth, stuffCtrl.createThing);
router.put(':id', auth, stuffCtrl.modifyThing);
router.delete(':id', auth, stuffCtrl.deleteThing);


module.exports = router;