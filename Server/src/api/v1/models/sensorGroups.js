var Joi = require('joi');

var schema = Joi.object({
    Id: Joi.number().required(),
    GroupId: Joi.number().required(),
    SensorId: Joi.number().required()
});

module.exports = {
    schema: schema
};