var express= require('express')
var router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs');
const db = require('../db/index')
const user = require('../models/users')
const student = require('../models/student')
const faculty = require('../models/faculty')


router.get('/', function(req, res, next) {
  res.render('./student/dashboard',{
    layout: 'student',
    first_name: req.user.first_name,
    middle_name: req.user.middle_name,
    last_name: req.user.last_name,
    suffix: req.user.suffix
  })
})

router.get('/profile', function(req, res, next) {
  student.getSectionData(req.user.id, function(sectionData) {
    console.log(sectionData)
    res.render('./student/profile',{
      layout: 'student',
      sectionData: sectionData,
      first_name: req.user.first_name,
      middle_name: req.user.middle_name,
      last_name: req.user.last_name,
      suffix: req.user.suffix
    })
  })
})

router.get('/group', function(req, res, next) {
  student.getMyGroupData(req.user.id, function(groupData) {
    student.getGroupMembers(groupData.group_id, function(groupMembers) {
      student.getThesisProposals(groupData.group_id, function(thesisProposals) {
        student.getApprovedThesis(groupData.group_id, function(approvedThesis) {
          student.checkIfNoMainTopic(groupData.group_id, function(noMainTopic) {
            student.getMainThesis(groupData.group_id, function(mainThesis) {
              console.log(mainThesis)
              res.render('./student/group', {
                layout: 'student',
                title: 'My Group',
                css: '/assets/student_my_group.css',
                first_name: req.user.first_name,
                middle_name: req.user.middle_name,
                last_name: req.user.last_name,
                suffix: req.user.suffix,
                group: groupData,
                groupMembers: groupMembers,
                thesisProposals: thesisProposals,
                approvedThesis: approvedThesis,
                noMainTopic: noMainTopic,
                mainThesis: mainThesis
              })
            })
          })
        })
      })
    })
  })
})


router.post('/group', function(req, res, next) {
  console.log(req.body)
  if (req.body.thesisProposalSubmit) {
    student.submitThesisProposal(req.body, function(data) {
      res.redirect('/student/group')
    })
  } else if (req.body.makeMainThesis) {
    student.makeMainThesis(req.body.thesisId, function(data) {
      res.redirect('/student/group')
    })
  } else {
    res.redirect('/student/group')
  }
})



router.get('/thesis/all', function(req, res, next) {
  var limit = 4
  faculty.getThesisList(req.session.titleQuery || "", undefined, undefined, undefined, limit, ((req.query.p - 1)*4 || 0), function(thesisList) {
    res.render('./student/thesis_list', {
      layout: 'student',
      title: 'Thesis List',
      first_name: req.user.first_name,
      middle_name: req.user.middle_name,
      last_name: req.user.last_name,
      suffix: req.user.suffix,
      thesisList: thesisList,
      pagination: {
        page: req.query.p || 1,
        limit: 4,
        n: req.query.p || 1
      }
    })
  })
})

router.post('/thesis/all', function(req, res, next) {
  var limit = 4
  if (req.body.clearSearch) {
    delete req.session.titleQuery
    res.redirect('/faculty/thesis')
  } else {
    req.session.titleQuery = req.body.titleQuery
    res.redirect('/faculty/thesis')
  }
})

module.exports = router