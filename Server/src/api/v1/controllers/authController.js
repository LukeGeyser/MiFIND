const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dbClient = require('../services/dbServices/dbClient');
const authService = require('../services/authService');
const authMiddleware = require('../middleware/authTokenMiddleware');
const clientService = require('../services/pwdService');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const errors = require('../../../constants/errorMessages');

var customError;

router.post('/login', 
  permissionsMiddleware.checkPermissionLogin(permissions.Login), 
  async (req, res, next) => {
  // Getting the Username and Password from response body
    try {
      const { username } = req.body;
      const { password } = req.body;

      if (username == "" || password == ""){
        res.status(403);
        customError = new Error();
        customError.CustomError = errors.UsrnPwd;
        return next(customError);
      }

      const userObject = await dbClient.getUser(username);

      if (!userObject) {
        res.status(403);
        customError = new Error();
        customError.CustomError = errors.NoUserFound;
        return next(customError);
      }

      var isValidPwd = await clientService.validatePassword(password, userObject.Password);

      if (!isValidPwd) {
        res.status(403);
        customError = new Error();
        customError.CustomError = errors.UsrnPwd;
        return next(customError); 
      }
      else {
        userObject.TokenVersion += 1;
        await dbClient.updateUserTokenVersion(userObject);

        var refreshToken = await authService.generateRefreshAuthToken(userObject.UserId, userObject.TokenVersion);
        var token = await authService.generateAuthToken(userObject.UserId, userObject.TokenVersion);

        await authService.setRefreshToken(refreshToken, res);

        var tokenCreationDate = new Date();

        var tokenExpireDate = new Date(tokenCreationDate.getTime() + 60 * 60000);

        var expiresIn = Math.abs(tokenExpireDate - tokenCreationDate) / 1000;

        return res.status(200).send({
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
      return next(error);
    }
});

router.post('/refresh_token', 
  authMiddleware.AuthenticateToken,
  permissionsMiddleware.checkPermission(permissions.RefreshToken),
  async (req, res, next) => {
  try {
    var refreshToken = req.cookies[process.env.REFRESH_TOKEN_ID];

    if (!refreshToken){
      res.status(401);
      customError = new Error();
      customError.CustomError = errors.MissingRefresh;
      return next(customError);  
    }
    
    var refreshTokenPayload = null;

    try {
      refreshTokenPayload = await authService.checkRefreshAuthToken(refreshToken);
    } catch (err) {
      res.status(500);
      customError = new Error();
      customError.CustomError = errors.InternalServerError;
      return next(customError);
    }

    if (!refreshTokenPayload){
      res.status(401);
      customError = new Error();
      customError.CustomError = errors.InvalidRefresh;
      return next(customError);
    }

    var user = await dbClient.getUserById(refreshTokenPayload.userId);

    if (!user){
      res.status(401);
      customError = new Error();
      customError.CustomError = errors.InvalidRefresh;
      return next(customError);
    }

    if (user.TokenVersion !== refreshTokenPayload.tokenVersion){
      res.status(401);
      customError = new Error();
      customError.CustomError = errors.InvalidRefresh;
      return next(customError);
    }
    
    var token = await authService.generateAuthToken(user.UserId, TokenVersion);

    var tokenCreationDate = new Date();

    var tokenExpireDate = new Date(tokenCreationDate.getTime() + 60 * 60000);

    var expiresIn = Math.abs(tokenExpireDate - tokenCreationDate) / 1000;

    user.TokenVersion += 1;
    console.log(user);
    await dbClient.updateUserTokenVersion(user);

    return res.status(200).send({
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
    return next(error);
  }
});

// TODO: NEED TO ADD SECURITY BEHIND THIS, ONLY AUTHORIZED USERS CAN ACCESS THIS ROUTE
router.post('/invalidate_token', 
  authMiddleware.AuthenticateToken, 
  permissionsMiddleware.checkPermission(permissions.RevokeToken), 
  async (req, res, next) => {
  try {
    // TODO: NEED TO AUTH USER TRYING TO GET INTO THIS ROUTE

    const { username } = req.body;

    const userObject = await dbClient.getUser(username);

    if (!userObject) {
      res.status(403);
      customError = new Error();
      customError.CustomError = errors.NoUserFound;
      return next(customError);
    }

    userObject.TokenVersion += 1;
    await dbClient.updateUserTokenVersion(userObject);

    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
