const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// LOCAL IMPORTS
const authService = require('../services/authService');
const dbGroups = require('../services/dbServices/dbGroups');

// TODO: Add Middleware here to prevent random access
router.get('/', authService.AuthenticateToken, async (req, res, next) => {


    try {
        var groups = await dbGroups.getGroups();

        res.json(groups);
    } catch (error) {
        next(error);
    }

});

module.exports = router;