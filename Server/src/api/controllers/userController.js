var crypto = require('crypto');
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

router.post('/login', async function (req, res) {

    // Getting the Username and Password from response body
    const { username } = req.body;
    const { password } = req.body;

    const userObject = await dataService.getUser(username);

    // TODO: CHECK USERNAME AND PASSWORD

    if (!userObject) {
        // Response with Invalide Creds
        return res.status(403).send({ error: 'No such user found' }); // TODO: Make this error Response more fleshed out
    }

    var isValidPwd = await clientService.validatePassword(password, userObject.Password);

    if (!isValidPwd)
        res.status(401).send({ error: 'No such user found' }); // TODO: Make this error Response more fleshed out
    else {

        var refreshToken = await authService.generateRefreshAuthToken(userObject.UserId, userObject.TokenVersion);
        var token = await authService.generateAuthToken(userObject.UserId);

        await authService.setRefreshToken(refreshToken, res);

        var tokenCreationDate = new Date();

        var tokenExpireDate = new Date(tokenCreationDate.getTime() + 60 * 60000);

        var expiresIn = Math.abs(tokenExpireDate - tokenCreationDate) / 1000;

        res.status(200).send({
            auth_status: 'Authorized',
            access_token: token,
            token_type: 'Bearer',
            expires_in: expiresIn,
            userName: username,
            '.issued': tokenCreationDate.toUTCString(),
            '.expires': tokenExpireDate.toUTCString(),
        });

    }
});

router.post('/changePassword', async function (req, res) {

    // Checking for Valid Token
    var isValidToken = null;
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

            isValidToken = await authService.checkAuthToken(token);

            if (!isValidToken) 
                return res.status(401).send({ error: "Token is not valid" }); // TODO: Make this error Response more fleshed out

        } else {
            return res.status(401).send({ error: "No token provided" }); // TODO: Make this error Response more fleshed out
        }
    
        
    } catch (error) {
        return res.status(500).send({error: error});
    }

    // Checking for Valid Credentials
    try {
        var username = req.body.username;
        var oldpassword = req.body.password;
        var newpassword = req.body.newpassword;

        var userObject = await dataService.getUser(username);

        if (!userObject) {
            // Response with Invalide Creds
            return res.status(403).send({ error: 'No such user found' }); // TODO: Make this error Response more fleshed out
        }

        if (userObject.UserId !== isValidToken.userId){
            return res.status(401).send(
                { 
                    authentication: 'false', 
                    reason: 'Token does not belong to a user',
                    access_token: '' 
                });
        }

        var pwdResponse = await clientService.validatePassword(oldpassword, userObject.Password);

        if (!pwdResponse){
            res.status(403).send({ error: "Username and Password is incorrect" }); // TODO: Make this error Response more fleshed out
            return;
        } else {
            var hash = await clientService.getPasswordHash(newpassword);

            var response = await dataService.updateUserPwd(userObject.UserId, hash);

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