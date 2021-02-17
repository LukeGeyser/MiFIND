const { detect } = require('detect-browser');
const browser = detect();

function getIPAddress(req){
    var IP = process.env.NODE_ENV == 'production' ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;
    return IP;
}

function getBrowserInfo(){
    if (browser) {
        return {
            Browser: {
                Name: browser.name,
                Version: browser.version,
                OS: browser.os
            },
        };
    }
}

module.exports = {
    getIPAddress,
    getBrowserInfo
};