const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: `Welcome to the User router` });
});

router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email }).exec().then( account => {
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
  User.findOne({ email: req.body.email }).exec().then(account => {
      account
      ? bcrypt.compare(req.body.password, account.password, (error, result) => {
        error 
        ? res.status(401).json({ message: `Authentication failed`, error: error })
        : result === true
          ? res.status(200).json({ message: `Authentication Successful`, result: result, account: account })
          : res.status(401).json({ message: `Authentication failed`, error: error })
      }) 
      : res.status(401).json({ message: `Authentication failed`, account: account });
    })
    .catch(error => res.status(500).json({ message: `Oops something happened`, error: error }));
});

router.delete('/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id }).exec()
    .then( account => res.status(200).json({ message: `Account deleted successfully`, account }) )
    .catch( error => res.status(500).json({ message: `Something happened`, error: error }) );
});

module.exports = router;