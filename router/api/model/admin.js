const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Admin = new Schema({
  _id: Schema.Types.ObjectId,
  image: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: "Enter Your fullname here"
  },
  username: {
    type: String,
    unique: true,
    required: 'Enter a username'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { collation: "admin" });