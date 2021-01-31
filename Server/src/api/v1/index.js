require('dotenv').config();

const rateLimit = require('express-rate-limit');
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const sensorController = require('./controllers/sensorController');
const errorHandler = require('./middleware/errorHandler');

const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 secs
    max: 100 // Limit each IP to 100 requests per windowMs
});

router.use(morgan('combined'));
router.use(helmet());

router.use(cookieParser());

router.use('/auth', limiter, authController);

router.use('/accounts', userController);

router.use('/sensors', sensorController);

router.use(errorHandler.notFound);

router.use(errorHandler.errorHandler);

module.exports = router;