const express = require('express');
const router = express.Router();

// LOCAL IMPORTS
const authService = require('../services/authService');
const modelValidator = require('../middleware/modelMiddleware');
const modelsDevice = require('../models/deviceModel');
const dbDevice = require('../services/dbServices/dbDevices');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const authMiddleware = require('../middleware/authTokenMiddleware');
const errors = require('../../../constants/errorMessages');

var customError;

router.get('/', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.GetAllDevices), 
    async (req, res, next) => {
        try {

            var devices = await dbDevice.getAllDevices();

            return res.status(200).json(devices);

        } catch (error) {
            next(error);
        }
});

router.get('/:imei',
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.GetSingleDevice), 
    async (req, res, next) => {
        try {

            var device = await dbDevice.getSingleDevice(req.params.imei);

            if (device == null){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.NoDeviceFound;
                return next(customError);
            }

            var { GroupID } = device;

            var sensors = await dbDevice.getDevicesSensors(GroupID);

            await Promise.all(sensors.map(async sensor => {
                var attributes = await dbDevice.getDevicesAttributes(sensor.Id);
                
                sensor.Attributes = attributes;
            }));

            await Promise.all(sensors.map(async sensor => {
                await Promise.all(sensor.Attributes.map(async attribute => {
                    var data = await dbDevice.getAttributeValue(attribute.Id).then((data) => {
                        attribute.Value = data.AttributeValue;
                    });
                }));
            }));

            return res.status(200).json({
                Device: device,
                Sensors: sensors
            });

        } catch (error) {
            next(error);
        }
});

router.post('/insert', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.AddDevice), 
    modelValidator.validateBodySchema(modelsDevice.schema),
    async (req, res, next) => {
        try {

            await dbDevice.addDevice(req.body);

            return res.status(200).send();

        } catch (error) {
            next(error);
        }
});



module.exports = router;