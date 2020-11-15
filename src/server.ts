import * as http from 'http';
import * as dotenv from 'dotenv';
import * as app from './app';

dotenv.config()

const PORT = process.env.PORT || 5000
const hostname: string = process.env.HOST_NAME || '127.0.0.1'

const server = http.createServer(app)

server.listen(PORT, (): void => console.log(`Server started at http://${hostname}:${PORT}`))