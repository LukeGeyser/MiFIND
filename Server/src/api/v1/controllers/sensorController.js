const express = require('express');
const router = express.Router();
const MiDevice = require('../models/mideviceModel');
const dataservice = require('../services/dbServices/dbDevices');


router.post('/midevice', async function (req, res) {

    try {
        await MiDevice.schema.validateAsync(req.body);

        dataservice.addMiDEVICEData(req.body);

        return res.status(200).send();
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;