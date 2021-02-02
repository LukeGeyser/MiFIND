require('dotenv').config();
var mysql = require('mysql');
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');
const { reject } = require('async');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function addPermissionIndex(permissionIndex){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.PermissionIndex).insert({Description: permissionIndex.Description})
                .then(function (data) {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function addPermission(permission){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Permissions).insert({PermissionIndexId: permission.PermissionIndexId, UserId: permission.UserId})
                .then(function (data) {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function getPermissionForUser(userId){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('Description').from(tableNames.PermissionIndex).join(tableNames.Permissions, 'PermissionIndex.Id', 'Permissions.PermissionIndexId')
                .where('Permissions.UserId', userId)
                .then(function (data) {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

module.exports = {
    addPermissionIndex,
    addPermission,
    getPermissionForUser
};