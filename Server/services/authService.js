var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');
var crypto = require("crypto");

function generateToken(username){
    var token = jwt.sign({ id: username }, process.env.SECRET, {
        expiresIn: 300 // expires in 5 Minutes
    });

    // res.status(200).send({ auth: true, token: token });

    try {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
        });

        var processedPubKey = publicKey.slice(27, publicKey.length - 24 - 1);

        return processedPubKey;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    generateToken
}