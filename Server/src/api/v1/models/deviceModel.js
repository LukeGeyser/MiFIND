var Joi = require('joi');

var schema = Joi.object({
    Imei: Joi.number().required(),
    SerialNumber: Joi.string().required(),
    GroupID: Joi.number().required(),
    Name: Joi.string().required(),
    Description: Joi.string().required(),
    BussinessUnitID: Joi.number().required(),
    BusID: Joi.string().required(),
});

module.exports = {
    schema: schema
};