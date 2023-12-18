const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const postController = require('../Controller/postController');


router.get('/popular' ,postController.getTopPost);
// User get search tasks API
router.get('/search',auth.verifyToken , postController.randomSearch);
router.get('/recommandSearch',auth.verifyToken , postController.recommandSearch);
router.get('/detail/:id',auth.verifyToken,postController.getPostDetail);
router.get('/checkLike/:id',auth.verifyToken,postController.getUserLikeRecord);



router.post('/create',auth.verifyToken, postController.createPost);
router.put('/update',auth.verifyToken, postController.updatePost);

router.post('/:id/like',auth.verifyToken,postController.postLike);
router.delete('/:id/like',auth.verifyToken,postController.deleteLike);




module.exports = router;