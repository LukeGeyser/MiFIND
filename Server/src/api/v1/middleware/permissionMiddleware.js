const dbClient = require('../services/dbServices/dbClient');
const dbPermissions = require('../services/dbServices/dbPermissions');
var authService = require('../services/authService');
const errors = require('../../../constants/errorMessages');

function checkPermissionLogin(permission){
    return async function (req, res, next) {
        var isContained = false;
        try {
            const { username } = req.body;

            if (username == ""){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.UsrnPwd;
                return next(customError);
            }

            const { UserId } = await dbClient.getUser(username);

            var result = await dbPermissions.getPermissionForUser(UserId);

            result.forEach(perm => {
                if (perm.Description == permission){
                    isContained = true;
                }
            });

            if (!isContained){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.Unauthorized;
                return next(customError);
            } else
                return next();
            
        } catch (error) {
            return next(error);
        }

    };
}

function checkPermission(permission){
    return async function (req, res, next) {
        var isContained = false;
        try {
            const header = req.headers.authorization;
            const token = header && header.split(' ')[1];

            if (token == null){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.InvalidToken;
                return next(customError);
            }

            const { userId } = req.TokenData;

            var result = await dbPermissions.getPermissionForUser(userId);

            result.forEach(perm => {
                if (perm.Description == permission){
                    isContained = true;
                }
            });

            if (!isContained){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.Unauthorized;
                return next(customError);
            } else
                return next();
            
        } catch (error) {
            return next(error);
        }

    };
}

module.exports = {
    checkPermissionLogin,
    checkPermission
};