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
var newtotal = 0

var totaldownload = 0

var totaltransaction = 0
const userController = require('../controller-user/user-control')
const userPayment =require('../controller-user/user-payment')
const userSearching = require('../controller-user/user-search')
// paying all photographers
// const PayStack = require('paystack-node')

// let APIKEY = 'sk_live_2hWyQ6HW73jS8p1IkXmSWOlE4y9Inhgyd6g5f2R7'
// const environment = process.env.NODE_ENV

// const paystack = new PayStack(APIKEY, environment)

// photographer login
router.get("/login", function (req, res) {
  res.render("login", { messagetrue: true, message: " " })

})

//route for registration
router.get("/register", function (req, res) {
  res.render("register", { title: 'register' })
})


//authenticating user
//photographer dashboard
router.get("/photographerdash", function (req, res) {
  var user = req.session.results;
  var userId = req.session.userId;
  var companyname = req.session.companyname
  var profile_image = req.session.profile_image
  var email = req.session.email
    
  if (req.session.loggedin) {
         var total  = 0
         con.query('SELECT * FROM downloads WHERE photographer_id=?',[userId], function(error, results){
         if (error) 
          {
           throw error
          }
         else
            results.forEach(element => {
            total+=element.photo_price
            totaldownload = total
             });
             var total1  = 0
             con.query('SELECT * FROM transaction WHERE photographer_id=?',[userId], function(error, trans, fields){
              if (error) throw error
              
              else
                  trans.forEach(element => {
                  total1+=element.amount
                  totaltransaction = total1 
              });
              const chat = []
              Message.find({},(err, messages)=> {
                chat.push(messages)
              })
              console.log(chat)
              var redrawable =  totaldownload - totaltransaction
              res.render('dashboard',
              { 
                redrawable:redrawable,
                withdrawn:totaltransaction, 
                downloads:totaldownload,
                email:email, 
                data: companyname,
                pic: profile_image,
                message:chat

               })
             }) 
            
       })
       
     
  }
  else
   {
    res.redirect("/login")
  }
})



// ending of photographer's routes   

// route for user registration
router.get("/registeruser", function (req, res) {
  res.render("registeruser", { title: 'register' })
})

// route for user login 
router.get("/loginuser", function (req, res) {
  res.render("loginuser", { messagetrue: true, message: " " })
})
//landing page
router.get('/', userController.landing);
//user main dashboard after login 
router.get("/user", userController.userdashboard )


/// adding to cart
router.post('/addcart/:price/:imageid', userController.addpicTocart)

// cart route 
router.get("/cartpage", userController.mycart)

// paid images
router.get('/readydownloads', userController.mydownloadables )

// deleting cart
router.get("/cart/:cartid", userController.deleteingfromcart)

// paystack api call 
router.post('/payme', userPayment.initpay );

router.get('/paystack/callbackurl', userPayment.callbackhoo)
 
// download function
router.get('/downloadbutton/:name', userController.downloadbutton )

// searching for pictures
router.post("/search1",userSearching.usersearch);

// logout user
router.get("/logout", userController.userloggout );

router.get('/chat', function (req, res) {
  res.render('chatPage')
});

// search on the landing page
router.post("/search", function (req, res) {
  const stringPart = req.body.searchitem
  con.query('SELECT * FROM photos WHERE event_name=?', [stringPart], function (err, rows, fields) {
    if (err) throw err
    var data = [];
    var data1 = []
    for (i = 0; i < rows.length; i++) {
      data1.push(rows[i])
      data.push(rows[i].photo_name);

    }

    res.render("index1", { imagename: data1 })
  });
});

// user  searching event images when loggedin//


/// logout for photographers
router.get("/logout1", function (request, response) {
  request.session.destroy()
  cart = []
  response.render('login', { messagetrue: true, message: " Session destroyed logged out" })
}); 

module.exports = router
