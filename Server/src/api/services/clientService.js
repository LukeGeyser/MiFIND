var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');
var crypto = require("crypto");
var fs = require("fs");

function validatePassword(pwd, hash){
    return new Promise(function (resolve) {
        setTimeout(function () {
            bcrypt.compare(pwd, hash, function (err, res){
                if (err) throw err;

                resolve(res);
            });
        }, 0);
    });
}

function getPasswordHash(pwd){
    return new Promise(function (resolve) {
        setTimeout(function () {
            bcrypt.hash(pwd, 10, function (err, hash) {
                if (err) resolve(false);

                resolve(hash);
            });
        }, 0);
    });
}

module.exports = {
    validatePassword: validatePassword,
    getPasswordHash: getPasswordHash,
};