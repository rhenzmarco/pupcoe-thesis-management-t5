var express= require('express')
var router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs');
const db = require('../db/index')
const user = require('../models/users')
const student = require('../models/student')
const faculty = require('../models/faculty')
 router.get('/', function(req, res, next) {
  res.render('./faculty/dashboard',{
    layout: 'faculty',
    first_name: req.user.first_name,
    middle_name: req.user.middle_name,
    last_name: req.user.last_name,
    suffix: req.user.suffix
  })
})
 router.get('/class', function(req, res, next) {
  faculty.getClassData(req.user.id, function(classData) {
    res.render('./faculty/class_list',{
      layout: 'faculty',
      first_name: req.user.first_name,
      middle_name: req.user.middle_name,
      last_name: req.user.last_name,
      suffix: req.user.suffix,
      classData: classData
    })
  })
})
 router.post('/class', function(req, res, next) {
  faculty.getStudentsFromThisClass(req.body.classId, function(studentsData) {
    faculty.getClassInfo(req.body.classId, function(classData) {
      console.log(classData)
      res.render('./faculty/class_view', {
        layout: 'faculty',
        first_name: req.user.first_name,
        middle_name: req.user.middle_name,
        last_name: req.user.last_name,
        suffix: req.user.suffix,
        studentsData: studentsData,
        classData: classData[0]
      })
    })
    
  })
})
 module.exports = router 
