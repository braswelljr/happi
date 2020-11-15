const express = require("express");
const logger = require('morgan');
const {api, middleware} = require('./router/index');

const app = express();

// log incoming request to server
app.use(logger('dev'));

// support application/json type post data
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

app.use(`/`, (req, res)=> {
  res.status(200).json({
    message: `Welcome to the ${process.env.APP_NAME}`
  });
});


//api router
api.forEach((index) =>
  app.use(`/api/${index}`, require(`./routes/api/${index}`)));

//web router
middleware.forEach((index) =>
  app.use(`/${index.name}`,require(`./routes/middleware/${index.route}`)));

app.use('/',(req, res, next)=> {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(( req, res) => {
  res.status(500).json({
    message: ''
  })
});

module.exports = app