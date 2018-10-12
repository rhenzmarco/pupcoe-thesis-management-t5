var express= require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
	res.redirect('/login')
})

router.use('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/login')
})

module.exports = router