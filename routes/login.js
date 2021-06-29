'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const con = require('../database/connect')
const passwordHash = require('password-hash');
const url = require('url');
const session = require('express-session');
const cookieParser = require('cookie-parser');
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

/* photographer auth. */

  //// 
  router.post('/auth', function(request, response) {
	const sess = request.session;
	const  companyname = request.body.companyname;
	const incomingpassword = request.body.password;
	if (companyname && incomingpassword) {
		con.query('SELECT * FROM photographers WHERE companyname = ?', [companyname], function(error, results, next) {
			
			if(results.length >0)
			{
			    results.forEach(element => {
				       if( (passwordHash.verify(incomingpassword, element.password )) === true) {
						request.session.loggedin = true;
						request.session.userId = results[0].photographer_id;
						request.session.companyname = results[0].companyname;
						request.session.profile_image = results[0].profile_image;
						request.session.password = results[0].password;
						request.session.mobile_money_no = results[0].mobile_money_no;
						request.session.email = results[0].email;
						response.redirect('/photographerdash') 

				          }
			          else{    
						response.render('login',{messagetrue:true,message:" invalid password  enter the right password"})
				            }
			                             });
			}
          else{
			response.render('login',{messagetrue:true,message:" invalid credentials"})
		  }
		 });
	} 
	else {
		response.render('login',{messagetrue:true,message:" Enter Correct Credentials"})
	}
	
});

router.post('/authuser', function(request, response) {
     
	const  email = request.body.email;
	const incomingpassword = request.body.password;
	if (email && incomingpassword) {
		con.query('SELECT * FROM users WHERE email = ?', [email], function(error, User, fields) {
			
			if(User.length >0)
			{
			    User.forEach(element => {
				       if( (passwordHash.verify(incomingpassword, element.password )) === true) {
					    
							
					 request.session.loggedin = true
					 
					 request.session.userid = User[0].user_id;
			         request.session.username = User[0].username;
					 request.session.email = User[0].email;
					 request.session.number = User[0].user_id;
					 request.session.pic = User[0].profilepic;

					
					 response.redirect('/user')
					
						//  response.render('userdash',{imagename:[]})
				          }
			          else{
						response.render('loginuser',{messagetrue:true,message:"  password not found!"})
				            }
			                             });
			}
          else{
			response.render('loginuser',{messagetrue:true,message:"your password is wrong"})
		  }
		 });
	} 
	else {
		response.render('loginuser',{messagetrue:true,message:" invalid user credentials"})
	}
});



module.exports = router;
