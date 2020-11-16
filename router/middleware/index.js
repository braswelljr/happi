const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: process.env.APP_NAME });
});

module.exports = router;