require('dotenv').config();

const rateLimit = require('express-rate-limit');
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const sensorController = require('./controllers/sensorController');

const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 secs
    max: 2 // Limit each IP to 2 requests per windowMs
});

router.use(cookieParser());

router.use('/auth', limiter, authController);

router.use('/accounts', userController);

router.use('/sensors', sensorController);

module.exports = router;