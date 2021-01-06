var crypto = require("crypto");
var bcrypt = require('bcryptjs');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var dataService = require('../services/dataService');
var authService = require('../services/authService');

router.post("/create", (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    var hashedPassword = bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw res.status(500).send({ message: err.message });
        // TODO: STORE HASH IN DB
        dataService.createUser(username, hash);

        return res.status(201).send({ message: "User was created successfully" });
    });

});

router.post("/login", async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    var userObject = await dataService.getUser(username);
    
    try {
        console.log(authService.generateToken(userObject[0].UserName));
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

    
    
});

module.exports = router;

// [
//     RowDataPacket {
//       UserId: 5,
//       UserName: 'Luke',
//       Password: '$2a$10$8TGOWycDbVoT1PO0ZVHa7eFgdu2dNkde482oiLnqs09HDnK6cXHqO',
//       CreationDate: 2020-12-23T10:31:29.000Z
//     }
//   ]