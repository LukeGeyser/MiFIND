require('dotenv').config();
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');

async function insertBU(schema){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.BussinessUnits).insert(schema)
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
    insertBU,
};