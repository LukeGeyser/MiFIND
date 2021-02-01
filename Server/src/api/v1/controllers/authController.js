const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dbClient = require('../services/dbServices/dbClient');
const authService = require('../services/authService');
const clientService = require('../services/clientService');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 Mins
//   max: 100 // Limit each IP to 100 requests per windowMs
// });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', permissionsMiddleware.checkPermissionLogin(permissions.Login), async (req, res, next) => {
  // Getting the Username and Password from response body
  try {
    const { username } = req.body;
    const { password } = req.body;

    const userObject = await dbClient.getUser(username);

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
      await dbClient.updateUserTokenVersion(userObject);

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
  } catch (error) {
    next(error);
  }
});

router.post('/refresh_token', async (req, res, next) => {
  try {
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

    var user = await dbClient.getUserById(refreshTokenPayload.userId);

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
  } catch (error) {
    next(error);
  }
});

// TODO: NEED TO ADD SECURITY BEHIND THIS, ONLY AUTHORIZED USERS CAN ACCESS THIS ROUTE
router.post('/invalidate_token', async (req, res, next) => {
  try {
    // TODO: NEED TO AUTH USER TRYING TO GET INTO THIS ROUTE

    const { username } = req.body;

    const userObject = await dbClient.getUser(username);

    if (!userObject) {
      // Response with Invalide Creds
      return res.status(403).send({ error: 'No such user found' }); // TODO: Make this error Response more fleshed out
    }

    userObject.TokenVersion += 1;
    await dbClient.updateUserTokenVersion(userObject);

    return res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
