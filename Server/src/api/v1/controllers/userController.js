var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// LOCAL IMPORTS
var dataService = require('../services/dbServices/dbClient');
var clientService = require('../services/pwdService');
var authService = require('../services/authService');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const modelValidator = require('../middleware/modelMiddleware');
const modelsClient = require('../models/clientModel');
const errors = require('../../../constants/errorMessages');
const authMiddleware = require('../middleware/authTokenMiddleware');

var customError;

router.post('/create', 
    modelValidator.validateBodySchema(modelsClient.insertSchema), 
    async function (req, res, next) {

    try {
        var hash = await clientService.getPasswordHash(req.body.Password);

        req.body.Password = hash;
        await dataService.createUser(req.body);

        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

router.post('/changePassword',
    authMiddleware.AuthenticateToken,
    permissionsMiddleware.checkPermission(permissions.ChangePassword),
    modelValidator.validateBodySchema(modelsClient.updatePwdSchema),
    async function (req, res, next) {

    var isValidToken = req.TokenData;
    try {

        var userObject = await dataService.getUser(req.body.UserName);

        if (!userObject) {
            res.status(403);
            customError = new Error();
            customError.CustomError = errors.NoUserFound;
            next(customError);
        }

        if (userObject.UserId !== isValidToken.userId){
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            next(customError);
        }

        var pwdResponse = await clientService.validatePassword(req.body.OldPassword, userObject.Password);

        if (!pwdResponse){
            res.status(403);
            customError = new Error();
            customError.CustomError = errors.UsrnPwd;
            next(customError);
        } else {
            var hash = await clientService.getPasswordHash(req.body.NewPassword);

            var response = await dataService.updateUserPwd(userObject, hash);

            if (!response){
                res.status(500);
                customError = new Error();
                customError.CustomError = errors.InternalServerError;
                next(customError);
            } else {
                res.status(200).send();
            }
        }
    } catch (error) {
        next(error);
    }

});


module.exports = router;