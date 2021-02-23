const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

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
const { generatePasswordRefreshToken, checkPasswordRefreshToken } = require('../services/authService');
const infoService = require('../services/requestInfoService');
const dbResetPWD = require('../services/dbServices/dbRefreshPwdToken');
const authService = require('../services/authService');
const defaultPerms = require('../../../constants/permissionsIndex');
const { transporter, options } = require('../../../lib/emailTransporter');
const { resetPWDTemplate } = require('../../../constants/handleBarSources');

var customError;

const baseResetURL = 'www.mifind.co.za';

router.post('/create', 
    modelValidator.validateBodySchema(modelsClient.insertSchema), 
    async function (req, res, next) {

    try {
        var hash = await clientService.getPasswordHash(req.body.Password);

        req.body.Password = hash;

        var response = await dataService.createUser(req.body);

        // CREATE THE DEFAULT PERMS FOR A USER
        await authService.applyUserPermission(defaultPerms.userBasicPermissions, response);

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

            var tokenData = await checkPasswordRefreshToken(token);

            var browserInfo = infoService.getBrowserInfo();

            var clientIP = infoService.getIPAddress(req);

            var modelData = {
                UserId: tokenData.userId,
                IP: clientIP,
                CreationDate: new Date(tokenData.iat * 1000).toUTCString(),
                ExpireDate: new Date(tokenData.exp * 1000).toUTCString(),
                Token: token,
                BrowserInfo: JSON.stringify(browserInfo)
            };

            await dbResetPWD.addRefreshPasswordToken(modelData);

            var passwordResetAddress = baseResetURL + '/ResetPassword?Token=' + token; // TODO: Needs to be generated
            var userEmail = req.body.Email;
            let info = await transporter.sendMail(options(userEmail, {passwordResetAddress, userEmail}, 'MiTRACE | Password Reset', resetPWDTemplate));

            return res.status(200).send({passwordResetAddress, info});
            // return res.status(200).send({passwordResetAddress});


        } catch (error) {
            return next(error);
        }
});

module.exports = router;