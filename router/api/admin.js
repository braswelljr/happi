const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();