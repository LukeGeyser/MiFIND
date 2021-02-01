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

function addMiDEVICEData(schema){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Data).insert(schema).then(() => {
                resolve();
            }).catch((err) => {
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
    addMiDEVICEData,
};