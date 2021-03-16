require('dotenv').config();
var mysql = require('mysql');
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');

async function getGroups(){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Groups)
                .then(function (data) {
                    resolve(data);
                });
        }, 0);
    });
}

module.exports = {
    getGroups,
};