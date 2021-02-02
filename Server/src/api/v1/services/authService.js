var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var fs = require('fs');
require('dotenv').config();
const cookies = require('cookie-parser');

function generatePublicPrivateKeysForToken(){

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

        fs.writeFileSync('rsa-public-key.pem', publicKey);
        fs.writeFileSync('rsa-private-key.pem', privateKey);

    } catch (error) {
        console.log(error);
    }
}

function generatePublicPrivateKeysForRefreshToken(){

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

        fs.writeFileSync('rsa-public-key-refresh.pem', publicKey);
        fs.writeFileSync('rsa-private-key-refresh.pem', privateKey);

    } catch (error) {
        console.log(error);
    }
}

function checkAuthToken(token){
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (token == null) resolve(false);
  
            var certPub = fs.readFileSync('rsa-public-key.pem');

            jwt.verify(token, certPub, function(err, decoded) {
                if (err) resolve(false);

                resolve(decoded);
            });
        }, 0);
    });
}

function checkRefreshAuthToken(token){
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (token == null) resolve(false);
  
            var certPub = fs.readFileSync('rsa-public-key-refresh.pem');

            jwt.verify(token, certPub, function(err, decoded) {
                if (err) resolve(false);

                resolve(decoded);
            });
        }, 0);
    });
}

function generateAuthToken(userId){
    const certPriv = fs.readFileSync('rsa-private-key.pem');

    const token = jwt.sign({ userId: userId }, certPriv, {
        expiresIn: '1d', // expires in 15 minutes 15m
        algorithm: 'RS256',
    });

    return token;
}

function generateRefreshAuthToken(userId, tokenVersion){
    const certPriv = fs.readFileSync('rsa-private-key-refresh.pem');

    const token = jwt.sign({ userId: userId, tokenVersion: tokenVersion }, certPriv, {
        expiresIn: '7d', // expires in 7 days
        algorithm: 'RS256',
    });

    return token;
}

function setRefreshToken(token, res){
    res.cookie(process.env.REFRESH_TOKEN_ID, token, {
        httpOnly: true,
        path: '/api/v1/auth/refresh_token',
        expires: new Date(Date.now() + 604800000)
    });
}

module.exports = {
    generatePublicPrivateKeysForToken: generatePublicPrivateKeysForToken,
    generatePublicPrivateKeysForRefreshToken: generatePublicPrivateKeysForRefreshToken,
    generateAuthToken: generateAuthToken,
    generateRefreshAuthToken: generateRefreshAuthToken,
    checkAuthToken: checkAuthToken,
    checkRefreshAuthToken: checkRefreshAuthToken,
    setRefreshToken: setRefreshToken,
};

