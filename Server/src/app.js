const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const api = require('./api/v1');
var cookieParser = require('cookie-parser');
const authService = require('./api/v1/services/authService');

// authService.generatePublicPrivateKeysForToken();
// authService.generatePublicPrivateKeysForRefreshToken();

const app = express();

app.set('trust proxy', 1); // If App is behind proxy, this is needed

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/v1', api);

module.exports = app;
