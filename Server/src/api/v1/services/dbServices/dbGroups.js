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