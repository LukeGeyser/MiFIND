require('dotenv').config();
var mysql = require('mysql');
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function addDevice(schema){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Devices).insert(schema).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        }, 0);
    });
}

function getAllDevices(){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Devices)
                .then((data) => {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

function getSingleDevice(imei){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Devices)
                .where({Imei: imei})
                .first()
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

function getDevicesSensors(groupId){
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            db.select('Sensors.*').from(tableNames.Sensors)
                .join(tableNames.SensorGroups, 'SensorGroups.SensorId', 'Sensors.Id')
                .where('SensorGroups.GroupId', groupId)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

function getDevicesAttributes(sensorId){
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            db.select('Attributes.*').from(tableNames.Attributes)
                .join(tableNames.SensorAttributes, 'SensorAttributes.AttributeId', 'Attributes.Id')
                .where('SensorAttributes.SensorId', sensorId)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

// SELECT * 
// FROM Attributes 
// INNER JOIN SensorAttributes ON Attributes.Id = SensorAttributes.AttributeId 
// WHERE SensorAttributes.SensorId = 1

module.exports = {
    addDevice,
    getAllDevices,
    getSingleDevice,
    getDevicesSensors,
    getDevicesAttributes,
};