var express= require('express')
var router = express.Router()
var _ = require('lodash')
const admin = require('../models/admin')
const user = require('../models/users')

router.get('/', function(req, res, next) {
	res.render('./admin/dashboard', {
		layout: 'admin'
	})
})



router.get('/faculty/create', function(req, res, next) {
	res.render('./admin/faculty_create', {
    layout: 'admin',
    title: 'Faculty Create',
    error: req.flash('facultyCreateError'),
    success: req.flash('facultyCreateSuccess'),
    prefix: req.flash('facultyPrefix'),
    firstName: req.flash('facultyFirstName'),
    middleName: req.flash('facultyMiddleName'),
    lastName: req.flash('facultyLastName'),
    suffix: req.flash('facultySuffix'),
    email: req.flash('facultyEmail'),
    phoneNumber: req.flash('facultyPhoneNumber'),
  })
})

router.post('/faculty/create', function(req, res, next) {
  if (req.body.password1 === req.body.password2){
    admin.createFaculty(req.body, function(data) {
      if (data === 'Email is already in used.'){
        req.flash('facultyCreateError', data)
        req.flash('facultySuffix', req.body.suffix)
        req.flash('facultyFirstName', req.body.firstName)
        req.flash('facultyPrefix', req.body.prefix)
        req.flash('facultyLastName', req.body.lastName)
        req.flash('facultyMiddleName', req.body.middleName)
        req.flash('facultyEmail', req.body.email)
        req.flash('facultyPhoneNumber', req.body.phoneNumber)
        res.redirect('/admin/faculty/create')
      } else {
        req.flash('facultyCreateSuccess', '<strong>Success!</strong> Faculty account created.')
        res.redirect('/admin/faculty/create')
      }

    })
  } else {
    req.flash('facultyCreateError','<strong>Warning!</strong> Password mismatched')
    req.flash('facultySuffix', req.body.suffix)
    req.flash('facultyFirstName', req.body.firstName)
    req.flash('facultyPrefix', req.body.prefix)
    req.flash('facultyLastName', req.body.lastName)
    req.flash('facultyMiddleName', req.body.middleName)
    req.flash('facultyEmail', req.body.email)
    req.flash('facultyPhoneNumber', req.body.phoneNumber)
    res.redirect('/admin/faculty/create')
  }
})

router.get('/student/create', function(req, res, next) {
  res.render('./admin/student_create', {
    layout: 'admin',
    title: 'Student Create',
    error: req.flash('studentCreateError'),
    success: req.flash('studentCreateSuccess'),
    firstName: req.flash('studentCreateFirstName'),
    middleName: req.flash('studentCreateMiddleName'),
    lastName: req.flash('studentCreateLastName'),
    suffix: req.flash('studentCreateSuffix'),
    email: req.flash('studentCreateEmail'),
    phoneNumber: req.flash('studentCreatePhoneNumber'),
    studentNumber: req.flash('studentCreateStudentNumber')
  })
})

router.post('/student/create', function(req, res, next) {
  if (req.body.password1 === req.body.password2){
    admin.createStudent(req.body, function(data) {
      console.log(data)
      if (data === 'Email is already in used.'){
        req.flash('studentCreateError', '<strong>Warning!</strong> ' + data)
        req.flash('studentCreateSuffix', req.body.suffix)
        req.flash('studentCreateFirstName', req.body.firstName)
        req.flash('studentCreateLastName', req.body.lastName)
        req.flash('studentCreateMiddleName', req.body.middleName)
        req.flash('studentCreateEmail', req.body.email)
        req.flash('studentCreatePhoneNumber', req.body.phoneNumber)
        req.flash('studentCreateStudentNumber', req.body.studentNumber)
        res.redirect('/admin/student/create')
      } else if (data === 'Student Number is already in used.'){
        req.flash('studentCreateError', '<strong>Warning!</strong> ' + data)
        req.flash('studentCreateSuffix', req.body.suffix)
        req.flash('studentCreateFirstName', req.body.firstName)
        req.flash('studentCreateLastName', req.body.lastName)
        req.flash('studentCreateMiddleName', req.body.middleName)
        req.flash('studentCreateEmail', req.body.email)
        req.flash('studentCreatePhoneNumber', req.body.phoneNumber)
        req.flash('studentCreateStudentNumber', req.body.studentNumber)
        res.redirect('/admin/student/create')
      }else {
        req.flash('studentCreateSuccess', '<strong>Success!</strong> Student account created.')
        res.redirect('/admin/student/create')
      }
    })
  } else {
    req.flash('studentCreateError','<strong>Warning!</strong> Password mismatched')
    req.flash('studentCreateSuffix', req.body.suffix)
    req.flash('studentCreateFirstName', req.body.firstName)
    req.flash('studentCreateLastName', req.body.lastName)
    req.flash('studentCreateMiddleName', req.body.middleName)
    req.flash('studentCreateEmail', req.body.email)
    req.flash('studentCreatePhoneNumber', req.body.phoneNumber)
    req.flash('studentCreateStudentNumber', req.body.studentNumber)
    res.redirect('/admin/student/create')
  }
})


router.get('/faculty/list', function(req, res, next) {
  admin.listFaculty(function(facultyList) {
    res.render('./admin/faculty_list', {
      layout: 'admin',
    title: 'Faculty list',
      facultyList: facultyList
    })
  })
})

router.get('/student/list', function(req, res, next) {
  admin.listStudent(function(studentList) {
    console.log(studentList)
    res.render('./admin/student_list', {
      layout: 'admin',
      title: 'Student List',
      success: req.flash('createClassSuccess'),
      studentList: studentList
    })
  })
})


router.get('/class/create', function(req, res, next) {
  var d = new Date();
  var year = []
  year.push(d.getFullYear())
  year.push(d.getFullYear() - 1)
  year.push(d.getFullYear() - 2)
  year.push(d.getFullYear() - 3)
  var section = [1,2,3,4,5]

  admin.listFaculty(function(facultyList) {
    res.render('./admin/class_create',{
      layout: 'admin',
      title: 'Faculty Create',
      error: req.flash('classCreateError'),
      success: req.flash('classCreateSuccess'),
      year: year,
      section: section,
      facultyList: facultyList
    })
  })
})

router.post('/class/create', function(req, res, next) {
  console.log(req.body)
  admin.createClass(req.body, function(data) {
    if (data === 'existing') {
      req.flash('classCreateError','Error! already have a class with that batch and section.')
      res.redirect('/admin/class/create')
    } else {
      req.flash('classCreateSuccess', '<strong>Success!</strong> Class created.')
      res.redirect('/admin/class/create')
    }
  })
})




router.get('/class/list', function(req, res, next) {
  admin.getClassList(function(classList) {
    res.render('./admin/class_list', {
      layout: 'admin',
      classList: classList
    })
  })
})

router.post('/class/list', function(req, res, next) { 
  if (req.body.view){
    next()
  } else {
    admin.deleteClass(req.body.classId, function(data) {
      res.redirect('/admin/class/list')
    })
  }

})

router.post('/class/list', function(req, res, next) {
  admin.getClassData(req.body.classId, function(classData) {
    admin.getStudentsFromClass(req.body.classId, function(studentsData){
      admin.getStudentsNotInClass(req.body.classId, function(excludedStudentsData) {
        res.render('./admin/class_view', {
          layout: 'admin',
          classData: classData,
          studentsData: studentsData,
          excludedStudentsData: excludedStudentsData
        })
      })
    })
  })
})

router.post('/class/list/add-students', function(req,res,next) {
  admin.insertStudentsToThisClass(req.body.classId,req.body.studentIdToAdd, function(data) {
    res.redirect('/admin/class/list')
  })

})



router.get('/committee', function(req, res, next) {
  admin.getCommittee(function(committeeData) {
    admin.getCommitteeCandidates(function(committeeCandidates) {
      res.render('./admin/committee_list', {
        layout: 'admin',
        title: 'Committee',
        css: '/assets/committee_list.css',
        committeeData: committeeData,
        committeeCandidates: committeeCandidates,
        error: req.flash('committeeError'),
        success: req.flash('committeeSuccess')
      })
    })
  })
})

router.post('/committee', function(req, res, next) {
  if (req.body.addCommittee) {
    console.log('add committee')
    console.log(req.body)
    admin.addCommitteeMembers(req.body.facultyId, function(data) {
      if (data.code === '23505') {
        req.flash('committeeError', 'Error, that faculty is already a committee member.')
        next()
      } else {
        req.flash('committeeSuccess', 'Success')
        next()
      }
    })
  } else {
    console.log(req.body)
    admin.removeCommitteeMember(req.body.committeeId, function(data) {
      next()
    })
  }
})


router.post('/committee', function(req, res, next) {
  admin.getCommittee(function(committeeData) {
    admin.getCommitteeCandidates(function(committeeCandidates) {
      res.render('./admin/committee_list', {
        layout: 'admin',
        title: 'Committee',
        css: '/assets/committee_list.css',
        committeeData: committeeData,
        committeeCandidates: committeeCandidates,
        error: req.flash('committeeError'),
        success: req.flash('committeeSuccess')
      })
    })
  })
})

module.exports = router