const dbClient = require('../services/dbServices/dbClient');
const dbPermissions = require('../services/dbServices/dbPermissions');
var authService = require('../services/authService');

function checkPermissionLogin(permission){
    return async function (req, res, next) {
        var isContained = false;
        try {
            const { username } = req.body;

            const { UserId } = await dbClient.getUser(username);

            var result = await dbPermissions.getPermissionForUser(UserId);

            result.forEach(perm => {
                if (perm.Description == permission){
                    isContained = true;
                }
            });

            if (!isContained){
                return res.status(403).send({
                    Error: 'Access Denied',
                    Reason: 'Not Authorized to Access this Route'
                });
            } else
                next();
            
        } catch (error) {
            next(error);
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
                return res.status(401).send({
                    Error: 'Access Denied',
                    Reason: 'No Token provided'
                });
            }

            const { userId } = req.TokenData;

            var result = await dbPermissions.getPermissionForUser(userId);

            result.forEach(perm => {
                if (perm.Description == permission){
                    isContained = true;
                }
            });

            if (!isContained){
                return res.status(403).send({
                    Error: 'Access Denied',
                    Reason: 'Not Authorized to Access this Route'
                });
            } else
                next();
            
        } catch (error) {
            next(error);
        }

    };
}

module.exports = {
    checkPermissionLogin,
    checkPermission
};