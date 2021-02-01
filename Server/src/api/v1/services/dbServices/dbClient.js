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

module.exports = {
    createUser,
    getUser,
    getUserById,
    updateUserTokenVersion,
    updateUserPwd
};