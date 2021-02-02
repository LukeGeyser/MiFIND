module.exports = {
    InternalServerError: {
        Code: 'Internal Server Error',
        Reason: 'There was an Internal Server Error'
    },
    UsrnPwd: {
        Code: 'Forbidden',
        Reason: 'Username and Password is incorrect'
    },
    Unauthorized: {
        Code: 'Forbidden',
        Reason: 'Not Authorized to Access this Route'
    },
    MissingToken: {
        Code: 'Unauthorized',
        Reason: 'Token is not specified'
    },
    InvalidToken: {
        Code: 'Unauthorized',
        Reason: 'Specified Token is not Valid'
    },
    NoUserFound: {
        Code: 'Unauthorized',
        Reason: 'Specified User does not exist'
    },
    MissingRefresh: {
        Code: 'Unauthorized',
        Reason: 'Refresh Token was not found'
    },
    InvalidRefresh: {
        Code: 'Unauthorized',
        Reason: 'Specified Refresh Token is not Valid'
    },
};