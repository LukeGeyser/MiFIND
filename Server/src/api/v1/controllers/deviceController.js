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