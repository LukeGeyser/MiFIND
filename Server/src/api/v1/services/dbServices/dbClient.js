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

async function createUser(schema){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication).insert(schema)
                .then(function (data) {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        }, 0);
    });
}

async function getUser(UserName){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*').from(tableNames.Authentication).where('Username', UserName)
                .then(function (data) {
                    resolve(data[0]);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function getUserById(userId){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*').from(tableNames.Authentication).where('UserId', userId)
                .then(function (data) {
                    resolve(data[0]);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function updateUserTokenVersion(user){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication).where({ UserId: user.UserId.toString()}).update({TokenVersion: user.TokenVersion}).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        }, 0);
    });
}

function updateUserPwd(user, hash){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication).where({ UserId: user.UserId}).update({Password: hash}).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
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