const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();

const userController = require('../Controller/userController');

//get 
// router.get('/profile',auth.verifyToken ,auth.authorize("user"),userController.getProfile);

//post
router.post('/signup',userController.signUp);
router.post('/signin',userController.signIn);


module.exports = router;