function validateBodySchema(schema) {
    return async function (req, res, next) {
        
        try {
            const value = await schema.validateAsync(req.body);
            res.ValidBody = value;
            return next();
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = {
    validateBodySchema
};