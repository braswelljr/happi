const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: `Welcome to the User router` });
});

router.post('/signup', (req, res) => {
  User.find({ email: req.body.email }).exec().then( account => {
    account
    ? res.status(400).json({ message: `User exist!` })
    : bcrypt.hash(req.body.password, 10, (error, hash) => {
      if(error) res.status(404).json({ message: `Unexpected Error occured during signup`, error: error });
      const user = new User({
        _id: new mongoose.Types.ObjectId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: hash
      });
      user.save()
        .then( account => res.status(201).json({ message: `Signup Successful`, user: account }))
        .catch(error => res.status(500).json({ message: `Oops Something went wrong`, error: error }));
    }); 
  });
});

router.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  res.send(200).json({ message: `User login`, user: user });
});

router.delete('/:userid', (req, res) => {
  User.remove({ email: req.params.userid }).exec()
    .then( account => res.status(200).json({ message: `Account deleted successfully`, account }) )
    .catch( error => res.status(500).json({ message: `Something happened`, error: error }) );
});

module.exports = router;