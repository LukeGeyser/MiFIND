const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();
var authController = require('./auth/authController');
var dataController = require('./services/dataService');
var userController = require('./controllers/userController');

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  
app.use(bodyParser.json({}));

app.use('/api/auth', authController);

app.use('/test', (req, res) => {
})

app.use("/api/accounts", userController);

module.exports = app;