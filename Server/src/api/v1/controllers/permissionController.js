const express = require('express');
const router = express.Router();

// LOCAL IMPORTS
const modelValidator = require('../middleware/modelMiddleware');
const modelsPermIndex = require('../models/permissionIndexModel');
const modelsPerms = require('../models/permissionModel');
const dbPermissions = require('../services/dbServices/dbPermissions');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const authMiddleware = require('../middleware/authTokenMiddleware');

router.post('/index/create', 
    authMiddleware.AuthenticateToken,
    permissionsMiddleware.checkPermission(permissions.AddPermissionIndex), 
    modelValidator.validateBodySchema(modelsPermIndex.insertSchema), 
    async (req, res, next) => {
        try {

            const schema = res.ValidBody;

            var result = await dbPermissions.addPermissionIndex(schema);

            res.send('Done');

        } catch (error) {
            next(error);
        }
});

router.post('/create', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.AddPermissions), 
    modelValidator.validateBodySchema(modelsPerms.insertSchema), 
    async (req, res, next) => {
        try {

            const schema = res.ValidBody;

            var result = await dbPermissions.addPermission(schema);

            res.send('Done');

        } catch (error) {
            next(error);
        }
});

module.exports = router;