const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = {
    resetPWDTemplate: handlebars.compile(fs.readFileSync(path.join(__dirname + '..\\..\\templates\\passwordResetTemplate.hbs'), 'utf8')),
};