const authService = require('../services/authService');
const errors = require('../../../constants/errorMessages');

async function AuthenticateToken(req, res, next){
    try {
        const header = req.headers.authorization;
        const token = header && header.split(' ')[1];

        if (token == null) {
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            next(customError);
        }

        const isValidToken = await authService.checkAuthToken(token);

        if (!isValidToken) {
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            next(customError);
        }
        
        req.TokenData = isValidToken;
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = {
    AuthenticateToken
};