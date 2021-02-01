const dbClient = require('../services/dbServices/dbClient');
const dbPermissions = require('../services/dbServices/dbPermissions');

function checkPermissionLogin(permission){
    return async function (req, res, next) {
        
        try {
            const { username } = req.body;

            const { UserId } = await dbClient.getUser(username);

            var result = await dbPermissions.getPermissionForUser(UserId);

            if (result == null){
                return res.status(403).send({
                    error: 'Not Authorized to Access this Route'
                });
            }
            
            if (permission == result.Description){
                next();
            }
        } catch (error) {
            next(error);
        }

    };
}

module.exports = {
    checkPermissionLogin,
};