var Joi = require('joi');

var schema = Joi.object({
    DeviceID: Joi.number().required(),
    SerialNumber: Joi.number().required(),
    GroupID: Joi.number().required(),
});

module.exports = {
    schema: schema
};