require('dotenv').config();

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

var authController = require('./controllers/authController');
var userController = require('./controllers/userController');
var insertController = require('./controllers/insertController');
var refreshTokenController = require('./controllers/refreshTokenController');

router.use(cookieParser());

router.use('/refreshToken', refreshTokenController);

router.use('/auth', authController);

router.use('/accounts', userController);

router.use('/insert', insertController);

module.exports = router;