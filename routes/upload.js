
var express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const url = require('url');

const uucode = require("uuid/v4")
const Promise = require("bluebird");
const con = require('../database/connect');


// SET STORAGE
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // let fileExtension = path.extname(file.originalname).split('.')[1];
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })

router.post('/uploadfile', upload.array('myfile', 50), (req, res, next) => {
  userId = req.session.userId;

  const file = req.files;
  let photos = [];

  for (let i = 0; i < file.length; i++) {
    const photoname = file[i].originalname;
    const eventname = req.body.eventname;
    const price = req.body.price;
    const today = new Date();
    const photoid = uucode();


    const photodetails = {
      photo_id: photoid,
      photo_name: photoname,
      event_name: eventname,
      photo_price: price,
      photographer_id: userId,
      date_upload: today
    }

    photos.push(photodetails)

  }
    //  console.log(photos)
  // you need to write a query to insert all photos once
  // or insert one at a time can cause race condition, will be suboptimal
  // or promisify sstoring to db and store eact item one at at a time
  photos.forEach(element => {
    con.query('INSERT INTO photos SET ?',element, function(error, results){
      if(error)
      res.redirect('/uploadform')
    })
    
  });
  res.redirect('/allphoto')

})
module.exports = router;

