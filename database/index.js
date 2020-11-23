const mongoose = require('mongoose');

const dbname = process.env.DB_NAME || 'happi'
const hostname = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 27017
const url = `mongodb://${hostname}:${port}/${dbname}`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> console.log(`Database connected on ${port}`));
