var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const con = require('../database/connect')
const passwordHash = require('password-hash');
const generateid =  require('custom-id');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './userprofile')
  },
  filename: function (req, file, cb) {
    // let fileExtension = path.extname(file.originalname).split('.')[1];
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })  

router.post('/reg',upload.single('profilepic'), function(req,res,){
let newuserid =  generateid({
  "name":req.body.username,
  "email":req.body.email,
  randomLength:3
})

let file = req.file
const today = new Date();
hashed = passwordHash.generate(req.body.password)
 
const newuser =
{ 
    "user_id":newuserid,
    "username":req.body.username,
    "date_of_birth": req.body.date_of_birth,
    "phone_number": req.body.phone_number,
    "email":req.body.email,
    "password":hashed,
    "profilepic": file.originalname,
    "date_created":today,
    
}
con.query('INSERT INTO users SET ?',newuser, function (error, results, fields) {
  if (error) {
     res.render("error");
  }else{
      res.redirect('/loginuser')
  }
});
})
module.exports = router;