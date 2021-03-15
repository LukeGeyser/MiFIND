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

            var devices = await dbDevice.getAllDevicesForUser(req.TokenData.userId);

            return res.status(200).json(devices);

        } catch (error) {
            next(error);
        }
});

router.get('/groups/:groupID', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.GetAllDevices), 
    async (req, res, next) => {
        try {

            if (req.params.groupID == null || req.params.groupID == ''){
                res.status(400);
                customError = new Error();
                customError.CustomError = errors.MissingParamter;
                return next(customError);
            }

            var groupID = req.params.groupID;

            var devices = await dbDevice.getAllDevicesFromGroup(groupID);

            if (devices == null || devices.length === 0){
                res.status(403);
                customError = new Error();
                customError.CustomError = errors.NoDevicesInGroup;
                return next(customError);
            }

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

router.post('/data/insert', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.AddDevice), 
    // modelValidator.validateBodySchema(modelsDevice.schema),
    async (req, res, next) => {
        try {
            var attributes = [];

            const device = await dbDevice.getSingleDevice(req.body.Imei);

            var groupSensors = await dbDevice.getGroupSensor(device.GroupID);

            for(var attributename in req.body){
                if (attributename != 'Imei'){
                    var att = await dbDevice.getAttribute(attributename);
                    att.Data = req.body[attributename];

                    attributes.push(att);
                }
            }

            for (const key in groupSensors) {

                for (let index = 0; index < attributes.length; index++) {
                    const element = attributes[index];

                    var Index = await dbDevice.getAttributeSensorId(element.Id, groupSensors[key].SensorId);

                    // ADD TO DB THE NEW VALUES
                    if (Index != undefined){
                        var temp = await dbDevice.addNewAttributeValue(Index.Id, element.Data);
                    }
                }
            }
            return res.status(200).send(attributes);
        } catch (error) {
            next(error);
        }
});



module.exports = router;