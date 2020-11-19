const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const api  = require('./router');

const app = express();

dotenv.config();

// log incoming request to server
app.use(logger('dev'));
// support application/json type post data
app.use(express.json());
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.sendStatus(200).json({});
  }

  next();
});

// connnect application to database
require('./database');

app.get('/',(req, res) => {
  res.status(200).json({
    message: `Welcome to the ${process.env.APP_NAME}`
  })
})

//api router
api.forEach(index => app.use(`/api/${index}`, require(`./router/api/${index}`)));

// catch 404 and forward to error handler
app.use((req, res) => {
  res.sendStatus(404)
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  res.render('error');
});

module.exports = app