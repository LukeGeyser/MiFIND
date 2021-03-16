require('dotenv').config();
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');

async function createUser(schema){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication)
                .insert(schema)
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
            db.select('*')
                .from(tableNames.Authentication)
                .where('Username', UserName)
                .first()
                .then(function (data) {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function getUserById(userId){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db.select('*')
                .from(tableNames.Authentication)
                .where('UserId', userId)
                .first()
                .then(function (data) {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function updateUserTokenVersion(user){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication)
                .where({ UserId: user.UserId.toString()})
                .update({TokenVersion: user.TokenVersion})
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }, 0);
    });
}

async function updateUserPwd(user, hash){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.Authentication)
                .where({ UserId: user.UserId})
                .update({Password: hash})
                .then((data) => {
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