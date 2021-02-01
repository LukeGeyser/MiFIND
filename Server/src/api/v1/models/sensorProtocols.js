var Joi = require('joi');

var schema = Joi.object({
    ProtocolId: Joi.number().required(),
    SensorId: Joi.number().required()
});

module.exports = {
    schema: schema
};