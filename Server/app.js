const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  
app.use(bodyParser.json({}));

app.use("/hello", (res, req) => {
    console.log("hello");
});

module.exports = app;