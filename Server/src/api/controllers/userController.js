var crypto = require("crypto");
var bcrypt = require('bcryptjs');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var dataService = require('../services/dataService');
var authService = require('../services/authService');
var clientService = require('../services/clientService');

router.post('/create', async function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var hash = await clientService.getPasswordHash(password);

    dataService.createUser(username, hash, function(err, result) {
        if (err) {
            res.status(500).send({ message: "User Was Not created Successfully", error: err.message });
            return;
        } 

        return res.status(201).send({ message: "User was created successfully", creationData: new Date().toUTCString() });
    });
});

router.post('/changePassword', async function (req, res) {

    // Checking for Valid Token
    try {
        var header = req.headers.authorization || '';   // get the auth header
        var auth = header.split(/\s+/) || '';
        
        if (header == '')
            return res.status(401).send({ error: "Invalid Authorization" });

        if (auth != ''){
            var authType = auth[0];
            var token = auth[1];

            if (authType != "Bearer") {
                return res.status(401).send({ error: "Incorrect Auth Type" }); // TODO: Make this error Response more fleshed out
            }

            var isValidToken = await authService.authToken(token);

            if (!isValidToken) 
                return res.status(401).send({ error: "Token is not valid" }); // TODO: Make this error Response more fleshed out

        } else {
            return res.status(401).send({ error: "No token provided" }); // TODO: Make this error Response more fleshed out
        }
    
        
    } catch (error) {
        res.status(500).send({error: error});
    }

    // Checking for Valid Credentials
    try {
        var username = req.body.username;
        var oldpassword = req.body.password;
        var newpassword = req.body.newpassword;

        var userObject = await dataService.getUser(username);

        if (Object.keys(userObject).length <= 0){
            // Response with Invalide Creds
            res.status(403).send({ error: "No such user found" }); // TODO: Make this error Response more fleshed out
            return;
        }

        var pwdResponse = await clientService.validatePassword(oldpassword, userObject[0].Password);

        if (!pwdResponse){
            res.status(403).send({ error: "Username and Password is incorrect" }); // TODO: Make this error Response more fleshed out
            return;
        } else {
            var hash = await clientService.getPasswordHash(newpassword);

            var response = await dataService.updateUserPwd(userObject[0].UserId, hash);

            if (!response){
                res.status(500).send({ error: "Something went wrong" }); // TODO: Make this error Response more fleshed out
            } else {
                res.status(200).send(); // TODO: Make this error Response more fleshed out
            }
        }
        
    } catch (error) {
        res.status(500).send({error: error});
    }

});

module.exports = router;