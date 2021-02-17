require('dotenv').config();
var mysql = require('mysql');
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');
const { reject } = require('async');

async function addRefreshPasswordToken(model){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.insert(tableNames.ResetPasswordTokens)
            .insert(model)
            .then(function (data){
                resolve(data);
            })
            .catch(function (error) {
                reject(error);
            });
        }, 0);
    });
}

module.exports = {
    addRefreshPasswordToken,
};