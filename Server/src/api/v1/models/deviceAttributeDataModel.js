var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    AttributeValue: Joi.string().required(),
    SensorAttributeId: Joi.number().required()
});

module.exports = {
    schema: schema
};