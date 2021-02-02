var Joi = require('joi');

var schema = Joi.object({
    UserId: Joi.number().required(),
    UserName: Joi.string().required(),
    Password: Joi.string().required(),
    CreationDate: Joi.string().required(),
    TokenVersion: Joi.string().required()
});

var insertSchema = Joi.object({
    UserName: Joi.string().required(),
    Password: Joi.string().required(),
});

var updatePwdSchema = Joi.object({
    UserName: Joi.string().required(),
    OldPassword: Joi.string().required(),
    NewPassword: Joi.string().required(),
});

module.exports = {
    schema,
    insertSchema,
    updatePwdSchema
};