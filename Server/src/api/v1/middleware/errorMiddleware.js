const notFound = function (req, res, next) {
    const error = Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = function (error, req, res, next) {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    switch (error.code) {
        case 'ER_DUP_ENTRY':
            error.message = 'You are trying to add an item that already Exists';
            break;
        case 'ECONNRESET':
            error.message = 'Connection Issues, please check your connectivity';
            break;
        case 'ENOTFOUND':
            error.message = 'Connection Issues, please check your connectivity';
            break;
        case 'ESOCKET':
            break;
        default:
            break;
    }

    if (error.CustomError != null){
        return res.json({
            error: error.CustomError,
            code: process.env.NODE_ENV === 'production' ? '💻' : error.code,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
    }else {
        return res.json({
            message: error.message,
            code: process.env.NODE_ENV === 'production' ? '💻' : error.code,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
        });
    }
};

module.exports = {
    notFound,
    errorHandler
};