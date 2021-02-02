var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    Name: Joi.string().required(),
    Description: Joi.string().required(),
});

var insertSchema = Joi.object({
    Name: Joi.string().required(),
    Code: Joi.string().required(),
    Description: Joi.string().required(),
});

module.exports = {
    schema,
    insertSchema
};