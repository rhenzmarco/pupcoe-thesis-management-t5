const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const user = require('./users.js')
const _ = require('lodash')
var actions = {
  getClassData: (id, callback) => {
    const query = {
      text: `SELECT * FROM class WHERE advisor_id = ${id} AND is_deleted = false`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getClassInfo: (classId, callback) => {
    const query = {
      text: `SELECT * FROM class WHERE id = ${classId}`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(data.rows)
    })
  },

  getStudentsFromThisClass: (classId, callback) => {
    const query = {
      text: `SELECT first_name,middle_name,last_name,suffix,users.student_id,email,phone_number FROM class_cluster 
        INNER JOIN users ON users.id = class_cluster.student_id 
        WHERE class_cluster.class_id = ${classId}`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  createGroup: (classId, group_name, callback) => {
    const query = {
      text: `INSERT INTO groups (group_number, class_id) VALUES ($1, $2)`,
      values: [group_name, classId]
    }
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getGroups: (classId, callback) => {
    const query = {
      text: 'SELECT * FROM groups where class_id = $1',
      values: [classId]
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }, 
  getStudentsWithoutGroup: (classId, callback) => {
    const query = {
      text: `SELECT class_cluster.student_id, first_name,middle_name,last_name,suffix,email,phone_number 
        FROM class_cluster 
        INNER JOIN users ON users.id = class_cluster.student_id 
        WHERE class_cluster.class_id = ${classId} AND class_cluster.student_id NOT IN (SELECT member_id FROM group_cluster)`
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  addMembersToGroup: (body, callback) => {
    var query = {
      text: `INSERT INTO group_cluster (group_id, member_id) VALUES `
    }
    console.log(body)
    if (typeof(body.studentId) === 'string') {
      query.text = query.text + `(`+body.groupId+', ' + body.studentId + `)`
    } else if (typeof(body.studentId) === 'object') {
      query.text = query.text + `(`+body.groupId+', ' + body.studentId[0] + `) `
      for (x = 1; x< body.studentId.length;x++){
        query.text = query.text + `, (`+body.groupId+', ' + body.studentId[x] + `) `
      }
    }
    console.log(query.text)
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })

  }, 
  getGroupData: (classId, callback) => {
    const query = {
      text: ` SELECT group_cluster.id, groups.id as group_id, groups.group_number, group_cluster.member_id as member_id, first_name, middle_name, last_name, suffix FROM groups 
       INNER JOIN group_cluster ON group_cluster.group_id = groups.id
       INNER JOIN users ON users.id = group_cluster.member_id
       WHERE class_id = ${classId}
       ORDER BY group_number ASC, last_name ASC, first_name ASC`
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }, 
  removeMemberFromGroup: (student, callback) => {
    const query = {
      text: `DELETE FROM group_cluster WHERE id = ${student}`
    }
    console.log(query.text)
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },
  checkIfCommittee: (facultyId, callback) => { 
    const query = {
      text: `SELECT EXISTS (SELECT id FROM committee WHERE faculty_id = $1)`,
      values: [facultyId]
    }
    db.query(query).then(data => {
      return callback(data.rows[0].exists)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })

  },

  getThesisProposals: (filter, callback) => {
    const query = {
      text: `SELECT thesis.id as thesis_id, thesis.group_id, title, abstract, status, date_created, groups.group_number 
        FROM thesis
        INNER JOIN groups ON groups.id = thesis.group_id
        WHERE status = $1
        ORDER BY date_created ASC, status ASC`,
      values: [filter]
    }

    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  updateThesisProposal: (status, approved, thesisId, callback) => {
    const query = {
      text: `UPDATE thesis SET status = $1, date_updated = current_date, is_approved = $2 WHERE id = $3`,
      values: [status, approved, thesisId]
    }
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  getThesisList: (title,category,year,adviser, limit, offset, callback) => {
    const query = {
      text: `SELECT * FROM thesis WHERE title ILIKE '%${title}%'
        LIMIT ${limit} OFFSET ${offset}`,
      values: []
    }
    db.query(query).then(data => {
      console.log(query)
      console.log(data.rows)
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }

}

module.exports = actions