require('dotenv').config();
var mysql = require('mysql');
var async = require("async"); 

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function createUser(username, password){
    conn.query(`INSERT INTO Authentication (UserName, Password) VALUES ('${username}','${password}')`, (err, result) => {
        if (err) throw err.message;
        console.log("DATA INSERTED");
    })
}

function getUser(username){
    return new Promise(resolve => {
        setTimeout(() => {
            conn.query(`SELECT * FROM Authentication WHERE UserName='${username}' LIMIT 1`, (err, result) => {
                if (err) throw err.message;
                resolve(result);
            })
        }, 0)
    })
}

module.exports = {
    createUser,
    getUser
}