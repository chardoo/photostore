var express = require('express');
var router = express.Router();
const session = require('express-session');
const con = require('../database/connect');
const passwordHash = require('password-hash');
const generateid = require('custom-id');
const Message = require('../models/message')
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const {Donor} = require('../models/donor')
const {initializePayment, verifyPayment} = require('../config/paystack')(request);
var Cart = require('../models/cart');
router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

exports.landing = (req, res) =>{

        var init = Math.floor(Math.random() * 11);
        con.query('SELECT * FROM photos ORDER BY RAND() LIMIT ?',init, function (err, rows, fields) {
          if (err) throw err
          else
             var initial = [];
             for (i = 0; i < rows.length; i++) {
               initial.push(rows[i])
                }
           res.render('index1', { imagename: initial });
          }
          
        )
}


exports.userdashboard = (req, res) =>{
   
        const username = req.session.username
        const email = req.session.email
        const image = req.session.pic
        if (req.session.loggedin) 
        {
          // var cart = new Cart(req.session.cart ? req.session.cart : {});
         var num =  Math.floor(Math.random() * 11);
          con.query('SELECT * FROM photos ORDER BY RAND() LIMIT ? ',num, function (err, rows, fields) {
               if (err) throw error;

               var initialdata = [];
               for (i = 0; i < rows.length; i++)
               {
                 initialdata.push(rows[i])
                }
                 //  req.session.cart = cart
                 //  var cart = req.session.cart
                  res.render('userdash',
                  { imagename: initialdata,  
                    myimage: image,
                    name: username, 
                    mymail: email
                  })
           })  
        }


        else
         {
          res.redirect("/loginuser")
        }
      
}


exports.addpicTocart = (req, res) =>{

        const usernum = req.session.number
        var downloadId = req.params.imageid
        if (req.session.loggedin ) {
         var cart = new Cart(req.session.cart ? req.session.cart : {});
         con.query('SELECT * FROM photos WHERE photo_id=?', [downloadId], function(error, results){
          if(error) throw error
          else
          cart.add(results[0], downloadId);
          req.session.cart = cart;
          res.redirect("/user")
         })    
        }
          else {
          res.redirect("/loginuser")
        }

}


exports.mycart = (req, res) =>{
        const userId = req.session.userid
        const username = req.session.username
        const email = req.session.email
        const image = req.session.pic
        
        if (req.session.loggedin ) {
          if (!req.session.cart) {
            return res.render('cart', {
              cartimage: null,name: username,
              mymail: email
            });
          }
          var totalp = 0
          var cart = new Cart(req.session.cart);
          var cat =cart.getItems()
          cat.forEach(element => {
            totalp += element.item.photo_price
            newtotal = totalp
          });
          
          res.render("cart",
           { 
             amount: totalp,
             cartimage: cart.getItems(), 
             name: username,
              mymail: email 
          })
        }
        else {
          res.redirect("/loginuser")
        }
      
}


exports.mydownloadables = (req, res) =>{
        const username = req.session.username
        const email = req.session.email
        const image = req.session.pic
        if (req.session.loggedin){
        
              con.query('SELECT * FROM downloads WHERE useremail=? ORDER BY payment_date DESC',[email], 
              function(err, results, field){
                
                if (err) 
                   throw err
                else
                
                      res.render('payment',
                      {
                        pic:results,
                        name: username,
                         mymail: email 
                      })
              }) 
        }
        else
        {
          res.redirect('/loginuser')
        }
      
}

exports.downloadbutton = (req, res) =>{
   
        const imagename = req.params.name
        res.download('./uploads/'+imagename,imagename, function(err, results){
          if(err) 
          res.redirect('/readydownloads')
          else
          console.log("done download")
        });
}

exports.deleteingfromcart =(req, res) =>{
    
        var cartimageId = req.params.cartid
        
        if (req.session.loggedin) {
          var cart = new Cart(req.session.cart ? req.session.cart : {});
          cart.remove(cartimageId);
          req.session.cart = cart; 
          res.redirect("/cartpage")  
      }
}

exports.userloggout =(request, response) =>{
    
        request.session.destroy()
         cart = []
          
        response.render('loginuser', { messagetrue: true, message: " Session destroyed logged out" })
        
    
}