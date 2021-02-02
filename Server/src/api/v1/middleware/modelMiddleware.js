function validateBodySchema(schema) {
    return async function (req, res, next) {
        
        try {
            const value = await schema.validateAsync(req.body);
            res.ValidBody = value;
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    validateBodySchema
};