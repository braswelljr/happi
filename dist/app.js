"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express = require("express");
const logger = require("morgan");
const app = express();
// log incoming request to server
app.use(logger('dev'));
// support application/json type post data
app.use(express.json());
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
app.use(`/`, (req, res, next) => {
    res.status(200).json({
        message: `Welcome to the ${process.env.APP_NAME}`
    });
});
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((req, res, next) => {
    res.status(console_1.error || 500);
    res.json({
        message: ''
    });
});
module.exports = app;
