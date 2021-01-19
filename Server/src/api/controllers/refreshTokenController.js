const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

var authService = require('../services/authService');
var dataService = require('../services/dataService');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', async function (req, res) {
    
    var refreshToken = req.cookies[process.env.REFRESH_TOKEN_ID];

    if (!refreshToken)
    {
        return res.status(401).send(
            { 
                authentication: 'false', 
                reason: 'No Refresh Token Found', 
                access_token: '' 
            }); // TODO: Make this error Response more fleshed out   
    }
    
    var refreshTokenPayload = null;

    try {
        refreshTokenPayload = await authService.checkRefreshAuthToken(refreshToken);
    } catch (err) {
        console.log(err);
        return res.status(500).send(
            { 
                authentication: 'false', 
                reason: 'Internal Server Error', 
                access_token: '' 
            });
    }

    if (!refreshTokenPayload){
        return res.status(401).send(
            { 
                authentication: 'false', 
                reason: 'Invalid Refresh Token', 
                access_token: '' 
            });
    }

    var user = await dataService.getUserById(refreshTokenPayload.userId);

    if (!user){
        return res.status(404).send(
            { 
                authentication: 'false', 
                reason: 'Refresh token does not belong to a user', 
                access_token: '' 
            });
    }

    if (user.TokenVersion !== refreshTokenPayload.tokenVersion){
        return res.status(401).send(
            { 
                authentication: 'false', 
                reason: 'Invalid Refresh Token', 
                access_token: '' 
            });
    }

    var newRefreshToken = await authService.generateRefreshAuthToken(user.UserId, user.TokenVersion);
    var token = await authService.generateAuthToken(user.UserId);

    await authService.setRefreshToken(newRefreshToken, res);

    var tokenCreationDate = new Date();

    var tokenExpireDate = new Date(tokenCreationDate.getTime() + 60 * 60000);

    var expiresIn = Math.abs(tokenExpireDate - tokenCreationDate) / 1000;

    res.status(200).send({
        authentication: 'true', 
        reason: '', 
        token_type: 'Bearer',
        access_token: token,
        expires_in: expiresIn,
        userId: user.userId,
        '.issued': tokenCreationDate.toUTCString(),
        '.expires': tokenExpireDate.toUTCString(),
    });

});

module.exports = router;