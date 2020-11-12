"use strict";
const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const hostname = process.env.HOST || '127.0.0.1' || 'localhost';
const server = http.createServer(app);
server.listen(PORT, hostname, () => console.log(`Server started at http://${hostname}:${PORT}`));
