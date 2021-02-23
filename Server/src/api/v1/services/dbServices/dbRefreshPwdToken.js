require('dotenv').config();
var db = require('../../../../db');
var tableNames = require('../../../../constants/tableNames');

async function addRefreshPasswordToken(model){
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            db(tableNames.ResetPasswordTokens)
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