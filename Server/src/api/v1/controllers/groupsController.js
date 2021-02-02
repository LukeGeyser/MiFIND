const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// LOCAL IMPORTS
const authService = require('../services/authService');
const dbGroups = require('../services/dbServices/dbGroups');
const permissions = require('../../../constants/permissions');
const permissionsMiddleware = require('../middleware/permissionMiddleware');
const authMiddleware = require('../middleware/authTokenMiddleware');

router.get('/', 
    authMiddleware.AuthenticateToken, 
    permissionsMiddleware.checkPermission(permissions.GetGroups), 
    async (req, res, next) => {
    
    try {
        var groups = await dbGroups.getGroups();

        res.json(groups);
    } catch (error) {
        next(error);
    }

});

module.exports = router;