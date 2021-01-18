require('dotenv').config();

var express = require("express");
var router = express.Router();

var authController = require('./auth/authController');
var userController = require('./controllers/userController');
var insertController = require('./controllers/insertController');


router.use('/auth', authController);

router.use('/accounts', userController);

router.use('/insert', insertController);

module.exports = router;