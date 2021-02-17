var Joi = require('joi');

var schema = Joi.object({
    UserId: Joi.number().required(),
    Username: Joi.string().required(),
    Password: Joi.string().required(),
    CreationDate: Joi.string().required(),
    TokenVersion: Joi.string().required()
});

var insertSchema = Joi.object({
    Email: Joi.string().email().required(),
    Username: Joi.string().required(),
    Password: Joi.string().required(),
});

var resetPwdSchema = Joi.object({
    OldPassword: Joi.string().required(),
    NewPassword: Joi.string().required(),
});

var requestResetPwdSchema = Joi.object({
    Email: Joi.string().email().required(),
});

module.exports = {
    schema,
    insertSchema,
    resetPwdSchema,
    requestResetPwdSchema,
};