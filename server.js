const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config()

const PORT = process.env.PORT || 5000
const hostname = process.env.HOST_NAME || '127.0.0.1'

const server = http.createServer(app)

server.listen(PORT, hostname, () => console.log(`Server started at http://${hostname}:${PORT}`))