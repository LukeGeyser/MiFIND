var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');
var crypto = require("crypto");
var fs = require("fs");

function generatePublicPrivateKeys(){

    // TODO: Look into using this somehow, using Pub and Priv keys
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

        // var processedPubKey = publicKey.slice(27, publicKey.length - 24 - 2);

        fs.writeFileSync("rsa-public-key.pem", publicKey);
        fs.writeFileSync("rsa-private-key.pem", privateKey);

    } catch (error) {
        console.log(error);
    }
}

function authToken(token, res){
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (token == null) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
            var certPub = fs.readFileSync("rsa-public-key.pem");

            jwt.verify(token, certPub, function(err, decoded) {
                if (err) resolve(false);

                resolve(true);
            });
        }, 0);
    });
}

module.exports = {
    generatePublicPrivateKeys: generatePublicPrivateKeys,
    authToken: authToken
};

