var express= require('express')
var router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs');
const db = require('../db/index')
const user = require('../models/users')

router.get('/', function(req, res, next) {
	res.render('./login', {
    layout: 'main',
    error: req.flash('error')
  })
})


// create admin
// router.post('/', function(req, res, next) {
//   bcrypt.hash(req.body.password, 10).then(hash => {
//     console.log(hash)
//     const query = {
//       text: `INSERT INTO users (username,password,is_admin,user_type, first_name) VALUES ($1,$2,true,'admin','Administrator')`,
//       values: [req.body.username,  hash]
//     }
//     db.query(query).then(data => {
//       console.log(data)
//       res.redirect('/login')
//     }).catch(e => {
//       console.log(e)
//       res.redirect('/login')
//     })
//   }).catch(e => {
//     console.log(e)
//     res.redirect('/login')
//   })
// })



router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid credentials'}),
  function(req, res) {
    res.redirect('/login/account')
})


router.use('/account', function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.user_type === 'admin') {
      res.redirect('/admin')
    }
  }
})



module.exports = router