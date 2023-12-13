const express = require('express');
const router = express.Router();
// const auth = require('../utils/auth');
const hashTagController = require('../Controller/hashTagController');


// router.post('/create',postController.createPost);
router.get('/recommand',hashTagController.getTopHashTags);


module.exports = router;