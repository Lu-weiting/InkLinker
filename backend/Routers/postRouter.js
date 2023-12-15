const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const postController = require('../Controller/postController');


router.post('/create',auth.verifyToken, postController.createPost);
router.get('/popular' ,postController.getTopPost);
// User get search tasks API
router.get('/search',auth.verifyToken , postController.randomSearch);
router.get('/recommandSearch',auth.verifyToken , postController.recommandSearch);




module.exports = router;