const express = require('express');
const router = express.Router();

// LOCAL IMPORTS
const authService = require('../services/authService');
const modelValidator = require('../middleware/modelMiddleware');
const modelsBU = require('../models/bussinessUnitModel');
const dbBU = require('../services/dbServices/dbBussinessUnit');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const authMiddleware = require('../middleware/authTokenMiddleware');

router.post('/insert', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.AddBU),
    modelValidator.validateBodySchema(modelsBU.insertSchema),
    async (req, res, next) => {
        try {
            await dbBU.insertBU(req.body);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
});

module.exports = router;