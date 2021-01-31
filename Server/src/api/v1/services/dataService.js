require('dotenv').config();
var mysql = require('mysql');
var db = require('../../../db');
var tableNames = require('../../../constants/tableNames');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function createUser(username, password, callback){
    conn.query(`INSERT INTO Authentication (UserName, Password) VALUES ('${username}','${password}')`, function (err, result) {
        if (err) { 
            callback(err);
            return;
        }
        
        callback(null, result);
    });
}

async function getUser(UserName){
    return new Promise(function (resolve) {
        setTimeout(function () {
            db.select('*').from(tableNames.Authentication).where('Username', UserName)
                .then(function (data) {
                    resolve(data[0]);
                });
        }, 0);
    });
}

async function getUserById(userId){
    return new Promise(function (resolve) {
        setTimeout(function () {
            db.select('*').from(tableNames.Authentication).where('UserId', userId)
                .then(function (data) {
                    resolve(data[0]);
                });
        }, 0);
    });
}

async function updateUserTokenVersion(user){
    return new Promise(function (resolve) {
        setTimeout(function () {
            db(tableNames.Authentication).where({ UserId: user.UserId.toString()}).update({TokenVersion: user.TokenVersion}).then(function (data) {
                resolve(data);
            });
        }, 0);
    });
}

function updateUserPwd(userID, pwd){
    return new Promise(function (resolve) {
        setTimeout(function () {
            conn.query(`UPDATE Authentication SET Password='${pwd}' WHERE UserId='${userID}'`, function (err, result) {
                if (err) throw err.message;
                resolve(result);
            });
        }, 0);
    });
}

function storeToken(UserID, MAC, IP, Browser, CreationDate, ExpireDate, Token){
    return new Promise(function (resolve) {
        setTimeout(function () {
            conn.query(`INSERT INTO SessionTokens (UserID, MAC, IP, Browser, CreationDate, ExpireDate, Token)` + 
                        ` VALUES ('${UserID}','${MAC}','${IP}','${Browser}','${CreationDate}','${ExpireDate}','${Token}')`, function (err, result) {
                if (err) throw err.message;
                resolve(result);
            });
        }, 0);
    });
}

function getToken(UserID){
    return new Promise(function (resolve) {
        setTimeout(function () {
            conn.query(`SELECT * FROM SessionTokens WHERE UserID='${UserID}' LIMIT 1`, function (err, result) {
                if (err) throw err.message;
                resolve(result);
            });
        }, 0);
    });
}

function removeToken(TokenID){
    return new Promise(function (resolve) {
        setTimeout(function () {
            conn.query(`DELETE FROM SessionTokens WHERE TokenID=${TokenID}`, function (err, result) {
                if (err) resolve(false);
                resolve(true);
            });
        }, 0);
    });
}

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
    createUser: createUser,
    getUser: getUser,
    getUserById: getUserById,
    updateUserPwd: updateUserPwd,
    updateUserTokenVersion: updateUserTokenVersion,
    storeToken: storeToken,
    getToken: getToken,
    removeToken: removeToken,
    addMiDEVICEData: addMiDEVICEData,
};

