var express = require('express');
var exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const paginate = require('handlebars-paginate')
const Handlebars = require('handlebars')
var MomentHandler = require("handlebars.moment");
 

const user = require('./models/users') 



Handlebars.registerHelper('paginate', paginate);
MomentHandler.registerHelpers(Handlebars);
var app = express();
app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'}));
app.set('view engine', 'handlebars');
app.set('port',(process.env.PORT|| 3000));
app.use('/assets', express.static('assets'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(cookieParser('secret'));
app.use(session({
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,
            maxAge: 10800000 }
}))
app.use(flash());


app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new Strategy({
  usernameField: 'username',
  passwordField: 'password'
},
function(username, password, done) {
  user.getByUsername(username, function(user) {  	
    if (!user) { 
      console.log('no user exists')
      return done(null, false) 
    }
    bcrypt.compare(password, user.password).then(function(status) {
      if (status == false) { 
        console.log('incorrect password')
        return done(null, false) 
      }
      console.log('logged in')
      return done(null, user)
    }).catch(e => {
      console.log(e)
    });

 });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  user.getById(id, function (user) {
    cb(null, user);
  });
});


function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
      if (req.user.is_admin === true) {
          return next();
      }
      else{
        res.redirect('/login/account')
      }
    // });
  } else{
    res.redirect('/login');
  }
}

function isFaculty(req, res, next) {
  if (req.isAuthenticated()) {
      if (req.user.user_type === 'faculty') {
          return next();
      }
      else{
        res.redirect('/login/account')
      }
    // });
  } else{
    res.redirect('/login');
  }
}

function isStudent(req, res, next) {
  if (req.isAuthenticated()) {
      if (req.user.user_type === 'student') {
          return next();
      }
      else{
        res.redirect('/login/account')
      }
    // });
  } else{
    res.redirect('/login');
  }
}



const indexRouter = require('./routes/index')
const studentRouter = require('./routes/student')
const adminRouter = require('./routes/admin')
const loginRouter = require('./routes/login')
const facultyRouter = require('./routes/faculty')



app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/student', isStudent, studentRouter)
app.use('/admin', isAdmin, adminRouter)
app.use('/faculty', isFaculty, facultyRouter)
// app.post('/asd/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}),
//   function(req, res) {
//     console.log('asd')
// })


app.use(function(req, res){
	res.send('error 404')
})
 
app.listen(app.get('port'),function(){
	console.log('Server started at port ' + app.get('port'))
});