var Joi = require('joi');

var mainSchema = Joi.object({
    Id: Joi.number().required(),
    PermissionIndexId: Joi.number().required(),
    UserId: Joi.number().required(),
    CreationDate: Joi.number().required(),
});

var insertSchema = Joi.object({
    PermissionIndexId: Joi.number().required(),
    UserId: Joi.number().required(),
});

module.exports = {
    mainSchema,
    insertSchema
};