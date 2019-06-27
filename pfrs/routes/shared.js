var express = require('express');
var router = express.Router();
var user = require('./../controllers/signup.js');

// router.post('/signup', user.createNewUser); 
router.post('/userLogin', user.login); 
// router.get('/users', user.users); 
router.delete('/users/:id', user.delete); 
// testing purpose
router.post('/signup', user.test); 
module.exports = router;