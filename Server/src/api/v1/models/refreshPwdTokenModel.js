var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    Name: Joi.string().required(),
});

var insertSchema = Joi.object({
    Id: Joi.number().required(),
    Name: Joi.string().required(),
});

module.exports = {
    schema: schema
};