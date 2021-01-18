const express = require('express');

const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const api = require('./api');

// authService.generatePublicPrivateKeys();

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(bodyParser.json());

app.use('/api/v1', api);

module.exports = app;
