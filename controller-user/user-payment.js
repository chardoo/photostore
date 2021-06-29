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


exports.initpay =(req, res) =>{
        const username = req.session.username
        const email = req.session.email
        const form = {amount:newtotal, full_name:username, email:email};
        form.metadata = {
            full_name : form.full_name
        }
        form.amount *= 100;
        initializePayment(form, (error, body)=>{
            if(error){
                throw error
                //handle errors
                // console.log(error);
                return;
            }
            response = JSON.parse(body);
            res.redirect(response.data.authorization_url)
        });
}


exports.callbackhoo = (req, res) =>{
        var cart = new Cart(req.session.cart);
        var cat =cart.getItems()
        const ref = req.query.reference;
        verifyPayment(ref, (error,body)=>{
            if(error){
                //handle errors appropriately
                console.log(error)
                return res.redirect('/cartpage');
            }
            response = JSON.parse(body);
            const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);
            
            [reference, amount, email, full_name] =  data;
            
            newDonor = {reference, amount, email, full_name}
            
            const donor = new Donor(newDonor)
           
            donor.save().then((donor)=>{
                if(!donor){
                    res.redirect('/cartpage');
                }
               
                
                const today = new Date();
                
                  cat.forEach(element => {
                    element.item.payment_date = today
                    element.item.useremail = email
                    con.query('INSERT INTO downloads SET ?',element.item)          
                   })
                
               
                res.redirect('/readydownloads')
            }).catch((e)=>{
                res.redirect('/cartpage');
           });
        });
      
}