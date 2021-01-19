const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const api = require('./api');
var cookieParser = require('cookie-parser');
const authService = require('./api/services/authService');

// authService.generatePublicPrivateKeysForToken();
// authService.generatePublicPrivateKeysForRefreshToken();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/v1', api);

module.exports = app;
