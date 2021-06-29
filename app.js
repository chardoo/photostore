var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession= require('cookie-session');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter =  require('./routes/login');
const con = require('./database/connect');

const registerRouter = require('./routes/register');
const registeruserRouter = require('./routes/usersreg')
const uploadRouter = require('./routes/upload');
const deleteRouter = require('./routes/deletepic');
// const editRouter = require('./routes/editregister')
const flash = require('connect-flash');



var app = express();




// app.use(flash());
// app.use(function(req, res, next){
// res.locals.success = req.flash('success');
// res.locals.errors = req.flash('error');
// next();
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/newone')));

app.use(bodyParser.urlencoded({extended: true}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/loginandregister')));
app.use(express.static(path.join(__dirname,'/phograp_static')));



app.use(express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/profiles')));
app.use(express.static(path.join(__dirname, '/newone')));


//  app.use('/index', indexRouter);
app.use('/', usersRouter);
app.use('/register', registerRouter);
app.use('/usersreg', registeruserRouter);
app.use('/',authRouter);

app.use('/upload',uploadRouter);
app.use('/deletepic',deleteRouter);
// app.use('/editregister',editRouter);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// app.use(
//   cookieSession({
//     name: config.COOKIE_NAME,
//     keys: [config.COOKIE_KEY],
//     maxAge: 24 * 60 * 60 * 1000
//   })
// );



 // upload image form 
 app.get("/uploadform", function(request, response){
	const user =  request.session.results;
	const userId = request.session.userId;
	const companyname =  request.session.companyname
  const profile_image = request.session.profile_image	
  const email = request.session.email
  
  if(request.session.loggedin){
  
    response.render("imageupload", {email:email, data:companyname, pic:profile_image} )
  }
  else{
    response.redirect("/login")
  }
});


 //  displaying  images folder
app.get("/allphoto", function(request, response){
	const user =  request.session.results;
	const userId = request.session.userId;
	const companyname =  request.session.companyname
  const profile_image = request.session.profile_image
  const email = request.session.email
  if(request.session.loggedin){
   con.query('SELECT * FROM photos WHERE photographer_id = ?', [userId], function(error, results){
    if(error){
      console.log(error)
    }
    else{
      
       var newresults = []
       results.forEach(element => {
        newresults.push(element.event_name);
       });
      var sortarr = []
      var newres = []
      sortarr =newresults.slice().sort()
      for(var i =0; i<sortarr.length; i++){
           if(sortarr[i]!=sortarr[i-1]){
             newres.push(sortarr[i])
           }
      } 
      response.render("picturesfolder",{email:email, allphoto:newres, data:companyname, pic:profile_image})
    }

    });
  }
  else{
    response.redirect("/login")
  }
});
// display image one by one
app.get("/:event", function(request,response){
	const user =  request.session.results;
	const userId = request.session.userId;
	const companyname =  request.session.companyname
  const profile_image = request.session.profile_image
  const email = request.session.email
  const eventpos = request.params.event
  if(request.session.loggedin){
  con.query('SELECT * FROM photos WHERE photographer_id=? AND event_name=?', [userId,eventpos], function(error,result){
   if (error) throw error
   else 
   response.render("eventimages",{email:email, allphoto:result, data:companyname, pic:profile_image})
  }) 
}
  else{
    response.redirect("/login")
  }
})







// app.use('/upload', uploadRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
