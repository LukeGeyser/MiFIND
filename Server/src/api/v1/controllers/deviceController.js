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

router.get('/', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.GetAllDevices), 
    async (req, res, next) => {
        try {

            var devices = await dbDevice.getAllDevices();

            res.status(200).json(devices);

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

            var { GroupID } = device;

            var sensors = await dbDevice.getDevicesSensors(GroupID);

            await Promise.all(sensors.map(async element => {
                var attributes = await dbDevice.getDevicesAttributes(element.Id);
                element.Attributes = attributes;
            }));

            res.status(200).json({
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

            res.status(200).send();

        } catch (error) {
            next(error);
        }
});



module.exports = router;