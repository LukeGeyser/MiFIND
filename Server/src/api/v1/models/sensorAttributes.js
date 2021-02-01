var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    AttributeId: Joi.number().required(),
    SensorId: Joi.number().required()
});

module.exports = {
    schema: schema
};