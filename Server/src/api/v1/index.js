require('dotenv').config();

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rfs = require('rotating-file-stream');


// LOCAL IMPORTS
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const sensorController = require('./controllers/sensorController');
const groupsController = require('./controllers/groupsController');
const permissionController = require('./controllers/permissionController');
const deviceController = require('./controllers/deviceController');
const bUController = require('./controllers/bUController');
const errorHandler = require('./middleware/errorMiddleware');
const generator = require('../../lib/accessLogGenerator');

const speedLimiter = slowDown({
    windowMs: 30 * 1000, // 15 minutes 15 * 60 * 1000
    delayAfter: 10, // allow 100 requests per 15 minutes, then...
    delayMs: 200 // begin adding 500ms of delay per request above 100:
});

const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 secs
    max: 20 // Limit each IP to 100 requests per windowMs
});

const stream = rfs.createStream(generator.generator, {
    interval: '1d', // rotate daily
    teeToStdout: true,
    path: __dirname + '../../../../logs/'
  });

router.use(morgan('combined', { stream: stream}));
router.use(helmet());

router.use(cookieParser());

router.use('/auth', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    authController);

router.use('/accounts', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    userController);

router.use('/sensors', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    sensorController);

router.use('/groups', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    groupsController);

router.use('/permissions', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    permissionController);

router.use('/device', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    deviceController);

router.use('/bu', 
    process.env.NODE_ENV == 'production' ? speedLimiter : function (req, res, next){next();}, 
    process.env.NODE_ENV == 'production' ? limiter : function (req, res, next){next();}, 
    bUController);

router.use(errorHandler.notFound);

router.use(errorHandler.errorHandler);

module.exports = router;