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

async function addDevice(schema){
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

async function getAllDevices(){
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

async function getAllDevicesForUser(userID){
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            db.select('Devices.*').from(tableNames.Devices)
                .join(tableNames.UserDevice, 'Devices.Imei', 'UserDevice.DeviceImei')
                .where('UserDevice.UserId', userID)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function getAllDevicesFromGroup(GroupID){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Devices)
                .where({ GroupID: GroupID })
                .then((data) => {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function getSingleDevice(imei){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Devices)
                .where({ Imei: imei })
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

async function getDevicesSensors(groupId){
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

async function getDevicesAttributes(sensorId){
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

async function getAttributeValue(attributeId){
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            db.select('DeviceAttributeData.AttributeValue')
                .from(tableNames.DeviceAttributeData)
                .join(tableNames.SensorAttributes, 'DeviceAttributeData.SensorAtrributeId', 'SensorAttributes.Id')
                .where('SensorAttributes.AttributeId', attributeId)
                .orderBy('TimeStamp', 'desc')
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

async function getAttribute(attributename){
    return new Promise(function (resolve, reject) {
        setTimeout(function (){
            db.select('*')
                .from(tableNames.Attributes)
                .where('Name', attributename)
                .first()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function getGroupSensor(groupId){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('SensorId')
                .from(tableNames.SensorGroups)
                .where('GroupId', groupId)
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function getAttributeSensorId(attributeId, SensorId){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('Id')
                .from(tableNames.SensorAttributes)
                .where('SensorId', SensorId)
                .where('AttributeId', attributeId)
                .first()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function addNewAttributeValue(sensorAttributeId, attributeValue){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.DeviceAttributeData)
                .insert({'SensorAtrributeId': sensorAttributeId, AttributeValue: attributeValue})
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

module.exports = {
    addDevice,
    getAllDevices,
    getSingleDevice,
    getDevicesSensors,
    getDevicesAttributes,
    getAttributeValue,
    getAttribute,
    getGroupSensor,
    getAttributeSensorId,
    addNewAttributeValue,
    getAllDevicesFromGroup,
    getAllDevicesForUser,
};