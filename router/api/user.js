const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: `Welcome to the User router`
  });
});

router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email }).exec()
    .then( account => {
      account
      ? res.status(400).json({ message: `User exist!` })
      : bcrypt.hash(req.body.password, 10, (error, hash) => {
        if(error) res.status(404).json({
          message: `Unexpected Error occurred during signup`,
          error: error
        });
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          password: hash
        });
        user.save()
          .then( account => res.status(201).json({
            message: `Signup Successful`,
            user: account
          }))
          .catch(error => res.status(500).json({
            message: `Oops Something went wrong`,
            error: error
          }));
      });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).exec()
    .then(account => {
      account
      ? bcrypt.compare(req.body.password, account.password, (error, result) => {
        if (error){
          res.status(401).json({
            message: `Authentication failed`,
            error: error
          });
        }
        else{
          if(result === true){
            const payload = {
              _id : account._id,
              firstname : account.firstname,
              lastname : account.lastname,
              username : account.username,
              email : account.email,
              phone: account.phone
            };
            jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '2h' }, (err,token) => {
              if (err) throw err;
              res.status(200).json({
                message: `Authentication Successful`,
                result: result,
                account: payload,
                token: token
              });
            });
          }else {
            res.status(401).json({
              message: `Authentication failed`,
              error: error
            });
          }
        }
      }) 
      : res.status(401).json({
          message: `Authentication failed`
      });
    })
    .catch(error => res.status(500).json({
      message: `Oops something happened`,
      error: error
    }));
});

router.patch('/update/:id', (req, res) => {
  res.json({
    message: `Update User Info`
  });
});

router.delete('/delete/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id }).exec()
    .then( account => res.status(200).json({
      message: `Account deleted successfully`,
      account: account
    }) )
    .catch( error => res.status(500).json({
      message: `Something happened`,
      error: error
    }) );
});

module.exports = router;