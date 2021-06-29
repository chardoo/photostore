const express = require('express');
const router = express.Router();
const session = require('express-session');
const con = require('../database/connect')
const fs = require('fs');
const path = require('path')
var carts = require('../routes/users');

var cart = carts.cart

router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// deleting an image from the database
router.post("/:id", function (req, res) {
  const thatid = req.params.id
  con.query('DELETE FROM photos WHERE photo_id=?', thatid, function (error, results, fields) {
    if (error) {
      const error = new Error('Please image was not able to delete')
      error.httpStatusCode = 400
      return next(error)
    }
    else {
      res.redirect('/allphoto')
      // console.log('image deleted');
    }

  })

})

// delete/allfolder
router.post("/folder/:event", function (req, res) {
  const thatevent = req.params.event
  userId = req.session.userId;
  if (req.session.loggedin) {
    con.query('DELETE FROM photos WHERE photographer_id=? AND event_name=?', [userId, thatevent], function (error, results, fields) {
      if (error) {
        const error = new Error('Please image was not able to delete')
        error.httpStatusCode = 400
        return next(error)
      }
      else {
        res.redirect('/allphoto')
        // console.log('image deleted');
      }
    })
  }
})


router.post("/cart/:cartid", function (req, res) {
  var cart = req.session.cart
  const cartimageId = req.params.cartid
  // console.log(cartimageId)
  
  if (req.session.loggedin) {
  
    for (let i = 0; i < cart.length; i++) 
    {
        if (cart[i]['photo_id'] === cartimageId) 
        {
          cart.splice(i,1)
          // console.log(cart)
          // console.log(req.session.cart) 
         break
        }
    }
  
   
  res.redirect("/cartpage")  
}
})

module.exports = router;
