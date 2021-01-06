var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');
var crypto = require("crypto");

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/token", (req, res) => {

    // TODO:
    // FIRST NEED TO ADD AUTHENTICATION ON THE USER TRYING TO LOGIN
    // req.

    // var hashedPassword = bcrypt.hashSync(req.body.password, 8); // FOR ENCRTPTING PASSWORD

    var token = jwt.sign({ id: "Lukeff" }, process.env.SECRET, {
        expiresIn: 300 // expires in 5 Minutes
    });

    res.status(200).send({ auth: true, token: token });

    crypto.createPrivateKey(crypto.randomBytes(16).toString('base64'));

});

router.get("/hello", (req, res) => {

    var header = req.headers.authorization || '';       // get the auth header
    var token = header.split(/\s+/).pop() || '';
  
    console.log(token);
  
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: err.message });
      
      res.status(200).send(decoded);
    });
  
    console.log("hello");
});

module.exports = router;