var Joi = require('joi');

var mainSchema = Joi.object({
    Id: Joi.number().required(),
    CreationDate: Joi.number().required(),
    Description: Joi.string().required(),
});

var insertSchema = Joi.object({
    Description: Joi.string().required(),
});

module.exports = {
    mainSchema,
    insertSchema
};