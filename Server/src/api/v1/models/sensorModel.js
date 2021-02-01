var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    Name: Joi.string().required(),
    Revision: Joi.string().required(),
});

module.exports = {
    schema: schema
};