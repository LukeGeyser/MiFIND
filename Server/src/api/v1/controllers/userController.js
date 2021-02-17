const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// LOCAL IMPORTS
const dataService = require('../services/dbServices/dbClient');
const clientService = require('../services/pwdService');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const modelValidator = require('../middleware/modelMiddleware');
const modelsClient = require('../models/clientModel');
const errors = require('../../../constants/errorMessages');
const authMiddleware = require('../middleware/authTokenMiddleware');
const { generatePasswordRefreshToken } = require('../services/authService');
const { transporter, options } = require('../../../lib/emailTransporter');
const { resetPWDTemplate } = require('../../../constants/handleBarSources');
const infoService = require('../services/requestInfoService');
const dbResetPWD = require('../services/dbServices/dbRefreshPwdToken');

var customError;

const baseResetURL = 'www.mifind.co.za';

router.post('/create', 
    modelValidator.validateBodySchema(modelsClient.insertSchema), 
    async function (req, res, next) {

    try {
        var hash = await clientService.getPasswordHash(req.body.Password);

        req.body.Password = hash;
        await dataService.createUser(req.body);

        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
});

router.post('/resetPassword',
    authMiddleware.AuthenticatePasswordRefreshToken,
    permissionsMiddleware.checkPermission(permissions.ChangePassword),
    modelValidator.validateBodySchema(modelsClient.resetPwdSchema),
    async function (req, res, next) {

        var browserInfo = infoService.getBrowserInfo();

        var clientIP = infoService.getIPAddress(req);

        var isValidToken = req.TokenData;
        try {

            var userObject = await dataService.getUserById(isValidToken.userId);

            if (!userObject) {
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.NoUserFound;
                return next(customError);
            }

            if (userObject.UserId !== isValidToken.userId){
                res.status(401);
                customError = new Error();
                customError.CustomError = errors.InvalidToken;
                return next(customError);
            }

            var pwdResponse = await clientService.validatePassword(req.body.OldPassword, userObject.Password);

            if (!pwdResponse){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.UsrnPwd;
                return next(customError);
            } else {
                var hash = await clientService.getPasswordHash(req.body.NewPassword);

                var response = await dataService.updateUserPwd(userObject, hash);

                if (!response){
                    res.status(500);
                    customError = new Error();
                    customError.CustomError = errors.InternalServerError;
                    return next(customError);
                } else {
                    return res.status(200).send();
                }
            }
        } catch (error) {
            return next(error);
        }

});

router.post('/requestResetPassword',
    authMiddleware.AuthenticateToken,
    permissionsMiddleware.checkPermission(permissions.ChangePassword),
    modelValidator.validateBodySchema(modelsClient.requestResetPwdSchema),
    async function (req, res, next) {
        try {
            var token = await generatePasswordRefreshToken(req.TokenData.userId);

            var passwordResetAddress = baseResetURL + '/ResetPassword?Token=' + token; // TODO: Needs to be generated
            var userEmail = req.body.Email;
            let info = await transporter.sendMail(options(userEmail, {passwordResetAddress, userEmail}, 'MiTRACE | Password Reset', resetPWDTemplate));

            return res.status(200).send({passwordResetAddress, info});

        } catch (error) {
            return next(error);
        }
});


module.exports = router;