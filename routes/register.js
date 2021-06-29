var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const con = require('../database/connect')
const passwordHash = require('password-hash');
const generateid =  require('custom-id');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './profiles')
  },
  filename: function (req, file, cb) {
    // let fileExtension = path.extname(file.originalname).split('.')[1];
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })  

router.post('/reg',upload.single('profilepic'), function(req,res,){

  // console.log('hello')
let newphotographerid =  generateid({
  "name":req.body.companyname,
  "email":req.body.email,
  randomLength:3
})
//  console.log(newphotographerid)
//  console.log(req.body.momo);
//  console.log(req.file)
  let file = req.file



const today = new Date();
hashed = passwordHash.generate(req.body.password)
 
const users =
{ 
    "photographer_id":newphotographerid,
    "companyname":req.body.companyname,
    "password":hashed,
    "email":req.body.email,
    "profile_image": file.originalname,
    "mobile_money_no": req.body.momo,
    "created_at":today,
    "updated_at":today
}
con.query('INSERT INTO photographers SET ?',users, function (error, results, fields) {
  if (error) {
    
  res.render("error");
  }else{
      res.redirect('/login')
  }
});
})
module.exports = router;