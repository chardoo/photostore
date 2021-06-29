var express = require('express');
var router = express.Router();
const session = require('express-session');
const con = require('../database/connect');
const _ = require('lodash');
var Cart = require('../models/cart');
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

exports.usersearch =(req, res) =>{
        const stringPart = req.body.searchitem
        const username = req.session.username
        const email = req.session.email
        const image = req.session.pic
        if (req.session.loggedin && req.session.cart) {
          con.query('SELECT * FROM photos WHERE event_name=?', [stringPart], function (err, rows, fields) {
            if (err) throw err
            var data = [];
            var data1 = []
            for (i = 0; i < rows.length; i++) {
              data1.push(rows[i])
              data.push(rows[i].photo_name);
      
            }
      
            res.render("userdash",
             { imagename: data1,
              myimage: image,
               name: username,
                mymail: email })
          });
        }
     
}