const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('./model/admin');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './router/api/updates/admin/');
  },
  filename: function (req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'
      ? cb(null, true)
      : cb(null, false)
  }
});

router.get('/', (req, res) => {
  res.json({
    message: `Welcome to the Admin router`
  });
});

router.post('/signup', upload.single('image'), (req, res) => {
  Admin.findOne({ email: req.body.email }).exec()
    .then( account => {
      account
      ? res.status(400).json({ message: `Registration failed` })
      : bcrypt.hash(req.body.password, 10, (error, hash) => {
        if(error) res.status(404).json({
          message: `Unexpected Error occurred during signup`,
          error: error
        });
        const admin = new Admin({
          _id: new mongoose.Types.ObjectId,
          image: req.body,
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          password: hash
        });
        admin.save()
          .then( account => {
            const payload = {
              _id : account._id,
              image: account.image,
              name : account.name,
              username : account.username,
              email : account.email,
              phone : account.phone,
              created_at : account.created_at
            };
            jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '2h' }, (err,token) => {
              if (err) throw err;
              res.status(201).json({
                message: `Signup Successful`,
                account: payload,
                token: token
              });
            });
          })
          .catch(error => res.status(500).json({
            message: `Oops Something went wrong`,
            error: error
          }));
      });
  });
});

router.post('/login', upload.none(), (req, res) => {
  Admin.findOne({ email: req.body.email }).exec()
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
              image: account.image,
              name : account.name,
              username : account.username,
              email : account.email,
              phone : account.phone
            };
            jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1 day' }, (err,token) => {
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

router.patch('/update/:id', upload.single("image"), (req, res) => {
  Admin.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
    .then(account => {
      account
      ? res.status(200).json({
        message: `Account Updated Successfully`,
        user: {
          _id : account._id,
          image: account.image,
          name : account.name,
          username : account.username,
          email : account.email,
          phone : account.phone
        },
        updated_at:  new Date().toISOString()
      })
      : res.status(403).json({
        message: `Account Update Unuccessful`
      });
    })
    .catch(error => res.status(500).json({
      message: `Oops something happened`,
      error: error
    }));
});

router.delete('/delete/:id', (req, res) => {
  Admin.deleteOne({ _id: req.params.id }).exec()
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