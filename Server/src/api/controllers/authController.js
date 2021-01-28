const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const dataService = require('../services/dataService');
const authService = require('../services/authService');
const clientService = require('../services/clientService');

router.post('/login', async (req, res) => {
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
    userObject.TokenVersion += 1;
    await dataService.updateUserTokenVersion(userObject);

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

router.post('/refresh_token', async (req, res) => {
  var refreshToken = req.cookies[process.env.REFRESH_TOKEN_ID];

  if (!refreshToken){
    return res.status(401).send({ 
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
    return res.status(500).send({ 
        authentication: 'false', 
        reason: 'Internal Server Error', 
        access_token: '' 
    });
  }

  if (!refreshTokenPayload){
    return res.status(401).send({ 
        authentication: 'false', 
        reason: 'Invalid Refresh Token', 
        access_token: '' 
    });
  }

  var user = await dataService.getUserById(refreshTokenPayload.userId);

  if (!user){
    return res.status(404).send({ 
        authentication: 'false', 
        reason: 'Refresh token does not belong to a user', 
        access_token: '' 
    });
  }

  if (user.TokenVersion !== refreshTokenPayload.tokenVersion){
    return res.status(401).send({ 
        authentication: 'false', 
        reason: 'Invalid Refresh Token', 
        access_token: '' 
    });
  }
  var token = await authService.generateAuthToken(user.UserId);

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
