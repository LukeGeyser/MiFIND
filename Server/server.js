const http = require('http');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

console.log("Listening...");

server.listen(PORT);