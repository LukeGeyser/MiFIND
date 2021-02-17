const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let transporter = nodemailer.createTransport({
    host: process.env.MAILER_SMTP_OUTGOING_SERVER,
    port: 587,
    auth: {
      user: process.env.MAILER_USERNAME, 
      pass: process.env.MAILER_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: false
    }
});

// LOCAL IMPORTS
const dataService = require('../services/dbServices/dbClient');
const clientService = require('../services/pwdService');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const modelValidator = require('../middleware/modelMiddleware');
const modelsClient = require('../models/clientModel');
const errors = require('../../../constants/errorMessages');
const authMiddleware = require('../middleware/authTokenMiddleware');
const defaultPerms = require('../../../constants/permissionsIndex');
const authService = require('../services/authService');

const source = fs.readFileSync(path.join(__dirname + '..\\..\\..\\..\\templates\\passwordResetTemplate.hbs'), 'utf8');

const resetPWDTemplate = handlebars.compile(source);

var customError;

router.post('/create', 
    modelValidator.validateBodySchema(modelsClient.insertSchema), 
    async function (req, res, next) {

    try {
        var hash = await clientService.getPasswordHash(req.body.Password);

        req.body.Password = hash;

        var response = await dataService.createUser(req.body);

        // CREATE THE DEFAULT PERMS FOR A USER
        await authService.applyUserPermission(defaultPerms.userBasicPermissions, response);

        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

router.post('/resetPassword',
    authMiddleware.AuthenticateToken,
    permissionsMiddleware.checkPermission(permissions.ChangePassword),
    modelValidator.validateBodySchema(modelsClient.resetPwdSchema),
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

router.post('/requestResetPassword', 
    authMiddleware.AuthenticateToken,
    permissionsMiddleware.checkPermission(permissions.ChangePassword),
    modelValidator.validateBodySchema(modelsClient.requestResetPwdSchema),
    async function (req, res, next) {
        try {
            var passwordResetAddress = 'www.google.com';
            let info = await transporter.sendMail(options('luke@miconsult.co.za', {passwordResetAddress}));

            res.status(200).send({MessageId: info.messageId});
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        } catch (error) {
           next(error);
        }
});

var options = (email, locals) => {
    return {
        from: `"MiTRACE" <${process.env.MAILER_USERNAME}>`,
        to: email,
        subject: 'MiTRACE | Password Reset',
        html: resetPWDTemplate(locals) // Process template with locals - {passwordResetAddress}
      };
};


module.exports = router;