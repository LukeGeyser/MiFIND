const express = require('express');
const router = express.Router();

// LOCAL IMPORTS
const authService = require('../services/authService');
const modelValidator = require('../middleware/modelValidator');
const modelsPermIndex = require('../models/permissionIndexModel');
const modelsPerms = require('../models/permissionModel');
const dbPermissions = require('../services/dbServices/dbPermissions');

// TODO: add this middleware back in 'authService.AuthenticateToken' after dev
router.post('/index/create', modelValidator.validateBodySchema(modelsPermIndex.insertSchema), async (req, res, next) => {
    try {

        const schema = res.ValidBody;

        var result = await dbPermissions.addPermissionIndex(schema);

        res.send('Done');

    } catch (error) {
        next(error);
    }
});

router.post('/create', modelValidator.validateBodySchema(modelsPerms.insertSchema), async (req, res, next) => {
    try {

        const schema = res.ValidBody;

        var result = await dbPermissions.addPermission(schema);

        res.send('Done');

    } catch (error) {
        next(error);
    }
});

module.exports = router;