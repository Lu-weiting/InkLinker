const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const postController = require('../Controller/postController');


// router.post('/create',postController.createPost);
router.get('/popular' ,postController.getTopPost);
// User get search tasks API
router.get('/search',auth.verifyToken , postController.randomSearch);




module.exports = router;