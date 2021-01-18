var Joi = require('@hapi/joi');

var schema = Joi.object({
    deviceId: Joi.number().required(),
    altitude: Joi.number().required(),
    course: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    speed: Joi.number().required(),
    protocol: Joi.number().required(),
    internalTamper: Joi.number(),
    bracketTamper: Joi.number(),
    poleTamper: Joi.number(),
    cpuTemp: Joi.number(),
    batteryVoltage: Joi.number(),
    supplyVoltage: Joi.number(),
    chargeStatus: Joi.number()
});

module.exports = {
    schema: schema
};