require('dotenv').config();

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

var authController = require('./controllers/authController');
var userController = require('./controllers/userController');
var sensorController = require('./controllers/sensorController');

router.use(cookieParser());

router.use('/auth', authController);

router.use('/accounts', userController);

router.use('/sensors', sensorController);

module.exports = router;