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
            return next(customError);
        }

        const isValidToken = await authService.checkAuthToken(token);

        if (!isValidToken) {
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            return next(customError);
        }
        
        req.TokenData = isValidToken;
        return next();

    } catch (error) {
        return next(error);
    }
}

async function AuthenticatePasswordRefreshToken(req, res, next){
    try {
        const token = req.query.Token;

        if (token == null) {
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            return next(customError);
        }

        const isValidToken = await authService.checkPasswordRefreshToken(token);

        if (!isValidToken) {
            res.status(401);
            customError = new Error();
            customError.CustomError = errors.InvalidToken;
            return next(customError);
        }
        
        req.TokenData = isValidToken;
        return next();

    } catch (error) {
        return next(error);
    }
}

module.exports = {
    AuthenticateToken,
    AuthenticatePasswordRefreshToken
};