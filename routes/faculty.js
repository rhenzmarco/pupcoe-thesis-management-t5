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

router.post('/class/groups', function(req, res, next) {
  if (req.body.manageGroups) {
    req.session.classIdForManagingGroup = req.body.classId
    res.redirect('/faculty/class/groups')
  } else if (req.body.createGroup) {
    if (!req.session.classIdForManagingGroup){
      res.redirect('/faculty/class')
    } else {
      console.log('creating a group')
      console.log(req.body)
      faculty.createGroup(req.session.classIdForManagingGroup, req.body.groupName, function(data) {
        res.redirect('/faculty/class/groups')
      })
    }
  } else if (req.body.addStudentToGroup) {
    console.log('adding member/s to a group')
    console.log(req.body)
    faculty.addMembersToGroup(req.body, function(data) {
      res.redirect('/faculty/class/groups')
    })
  } else if (req.body.removeFromGroup) {
    console.log(req.body)
    faculty.removeMemberFromGroup(req.body.groupClusterId, function(data) {
      res.redirect('/faculty/class/groups')
    })
  }
})

router.get('/class/groups', function(req, res, next) {
  if (!req.session.classIdForManagingGroup){
    res.redirect('/faculty/class')
  } else {
    faculty.getGroups(req.session.classIdForManagingGroup, function(groups) {
      faculty.getStudentsWithoutGroup(req.session.classIdForManagingGroup, function(studentsWithoutGroup) {
        faculty.getGroupData(req.session.classIdForManagingGroup, function(groupData) {
          res.render('./faculty/class_group', {
            layout: 'faculty',
            first_name: req.user.first_name,
            middle_name: req.user.middle_name,
            last_name: req.user.last_name,
            suffix: req.user.suffix,
            groups: groups,
            studentsWithoutGroup: studentsWithoutGroup,
            groupData: groupData
          })
        })
      })
    })
  }
})

router.get('/proposals', function(req, res, next) {
  faculty.checkIfCommittee(req.user.id, function(data) {
    faculty.getThesisProposals('For Approval', function(forApprovalThesis) {
      faculty.getThesisProposals('For Committee Approval', function(forCommitteeApprovalThesis) {
        console.log(data)
        res.render('./faculty/thesis_proposals', {
          layout: 'faculty',
          title: 'Thesis Proposals',
          first_name: req.user.first_name,
          middle_name: req.user.middle_name,
          last_name: req.user.last_name,
          suffix: req.user.suffix,
          committee: data,
          forApprovalThesis: forApprovalThesis,
          forCommitteeApprovalThesis: forCommitteeApprovalThesis
        })
      })
    })
  })
})



router.post('/proposals', function(req, res, next) {
  if (req.body.acceptThis) {
    console.log('faculty')
    faculty.updateThesisProposal('For Committee Approval', false, req.body.thesisId, function(data) {
      res.redirect('/faculty/proposals')
    })
  } else if (req.body.rejectThis) {
    console.log('faculty')
    faculty.updateThesisProposal('Rejected By Adviser', false, req.body.thesisId, function(data) {
      res.redirect('/faculty/proposals')
    })
  } else if (req.body.acceptThisCommittee) {
    console.log('committee')
    faculty.updateThesisProposal('Approved By Committee', true, req.body.thesisId, function(data) {
      res.redirect('/faculty/proposals')
    })
  } else if (req.body.rejectThisCommittee) {
    console.log('committee')
    faculty.updateThesisProposal('Rejected By Committee', false, req.body.thesisId, function(data) {
      res.redirect('/faculty/proposals')
    })
  }
})

router.get('/thesis', function(req, res, next) {
  var limit = 4
  faculty.getThesisList(req.session.titleQuery || "", undefined, undefined, undefined, limit, ((req.query.p - 1)*4 || 0), function(thesisList) {
    res.render('./faculty/thesis_list', {
      layout: 'faculty',
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

router.post('/thesis', function(req, res, next) {
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