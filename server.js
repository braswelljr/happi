const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000
const hostname = process.env.HOST || '127.0.0.1'

const server = http.createServer(app)

server.listen(PORT, hostname, () => console.log(`Server started at http://${hostname}:${PORT}`))
server.on('error', (error)=>{
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'PORT ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});