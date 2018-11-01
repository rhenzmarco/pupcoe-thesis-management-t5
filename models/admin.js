const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const user = require('./users.js')
const _ = require('lodash')
var actions = {
  createFaculty: (user, callback) => {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [user.email]
    }
    db.query(query).then(data => {
      if (data.rows[0]){
        callback('Email is already in used.')
      } else {
        bcrypt.hash(user.password1,5).then(hash => {
          console.log(hash)
          const query = {
            text: `INSERT INTO users (email,password,prefix,first_name,middle_name,last_name,suffix,phone_number,user_type, is_admin) 
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'faculty',$9)`,
            values: [user.email, hash, user.prefix, user.firstName, user.middleName, user.lastName, user.suffix, user.phoneNumber, user.isAdmin]
          }
          db.query(query).then(data => {
            callback(data)
          }).catch(e => {
            console.log(e)
            callback(e)
          })
        })
       }
    }).catch(e => console.log(e))
  },
  createStudent: (user, callback) => {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [user.email]
    }
    const query2 = {
      text: 'SELECT id FROM users WHERE student_id = $1',
      values: [user.studentNumber]
    }
    db.query(query).then(data => {
      if (data.rows[0]){
        callback('Email is already in used.')
      } else {
        db.query(query2).then(data2 => {
          if (data2.rows[0]){
            callback('Student Number is already in used.')
          } else {
            bcrypt.hash(user.password1,5).then(hash => {
              console.log(hash)
              const query = {
                text: `INSERT INTO users (email,password,first_name,middle_name,last_name,suffix,phone_number,student_id, user_type) 
                  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'student')`,
                values: [user.email, hash, user.firstName, user.middleName, user.lastName, user.suffix, user.phoneNumber, user.studentNumber]
              }
              db.query(query).then(data => {
                callback(data)
              }).catch(e => {
                console.log(e)
                callback(e)
              })
            })
          }
        }).catch(e => console.log(e))
      }
    }).catch(e => console.log(e))
  },

  listFaculty: (callback) => {
    const query = {
      text: `SELECT * FROM users WHERE user_type = 'faculty' ORDER BY last_name ASC`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  listStudent: (callback) => {
    const query = {
      text: `SELECT * FROM users WHERE user_type = 'student' ORDER BY last_name ASC`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  createClass: (classData, callback) => {
    const queryCheck = {
      text: `SELECT id FROM class WHERE batch = $1 AND section = $2 AND is_deleted = false`,
      values: [classData.batch, classData.section]
    }

    db.query(queryCheck).then(data => {
      if (data.rowCount > 0) {
        callback('existing')
      } else {
        const query = {
          text: `INSERT INTO class (batch, section, advisor_id) VALUES ($1,$2,$3); `,
          values: [classData.batch, classData.section, classData.advisorId]
        }
        db.query(query).then(data => {
          callback(data.rows)
        }).catch(e => {
          console.log(e)
          callback(e)
        })
      }
    })

  },

  getClassList: (callback) => {
    const query = {
      text: `SELECT class.id, batch, section, users.id as advisor_id, prefix,first_name,middle_name,last_name,suffix 
        FROM class INNER JOIN users ON users.id = class.advisor_id 
        WHERE is_deleted = false
        ORDER BY batch DESC, section ASC`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getStudentsFromClass: (classId, callback) => {
    const query = {
      text: `SELECT first_name,middle_name,last_name,suffix,users.student_id,email,phone_number FROM class_cluster INNER JOIN users ON users.id = class_cluster.student_id 
      WHERE class_id = $1`,
      values: [classId]
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getClassData: (classId, callback) => {
    const query = {
      text: `SELECT class.id,batch,section,prefix,first_name,middle_name,last_name,suffix FROM class INNER JOIN users ON users.id = class.advisor_id WHERE class.id = $1`,
      values: [classId]
    }
    db.query(query).then(data => {
      callback(data.rows[0])
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getStudentsNotInClass: (classId, callback) => {
    const query = {
      text: `SELECT * FROM users WHERE user_type = 'student' AND id NOT IN (SELECT student_id FROM class_cluster);`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  deleteClass: (classId, callback) => {
    const query = {
      text: `UPDATE class SET is_deleted = true WHERE id = $1`,
      values: [classId]
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  insertStudentsToThisClass: (classId, studentIdToAdd, callback) => {
    var query
    if (typeof(studentIdToAdd) === 'string') {
      query = {
        text: `INSERT INTO class_cluster (class_id, student_id) VALUES (${classId},${studentIdToAdd})`
      }
    } else if (typeof(studentIdToAdd) === 'object') {
      query = {
        text: `INSERT INTO class_cluster (class_id, student_id) VALUES (${classId},${studentIdToAdd[0]})`
      }
      for (x = 1; x< studentIdToAdd.length;x++){
        query.text = query.text + ', ('+classId+', '+studentIdToAdd[x]+')'
      }
    }
    
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getCommittee: (callback) => {
    const query = {
      text: `SELECT committee.id, prefix,first_name,middle_name,last_name,suffix FROM committee
        INNER JOIN users ON users.id = committee.faculty_id
        ORDER BY users.last_name ASC, users.first_name ASC`
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  getCommitteeCandidates: (callback) => {
    const query = {
      text: `SELECT id, prefix, first_name,middle_name,last_name,suffix,users.student_id,email,phone_number 
        FROM USERS WHERE user_type = 'faculty' AND id NOT IN (SELECT faculty_id FROM committee)
        ORDER BY users.last_name ASC, users.first_name ASC`
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },

  addCommitteeMembers: (facultyId, callback) => {
    var query = {
      text: `INSERT INTO committee (faculty_id) VALUES `
    }

    if (typeof(facultyId) === 'string') {
      query.text = query.text + `(` + facultyId + `)`
    } else if (typeof(facultyId) === 'object') {
      query.text = query.text + '(' + facultyId[0] + ') '
      for (x = 1; x< facultyId.length;x++){
        query.text = query.text + ', (' + facultyId[x] + ') '
      }
    }
    console.log(query)
    db.query(query).then(data => {
      callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },
  removeCommitteeMember: (committeeId, callback) => {
    const query = {
      text: `DELETE FROM committee WHERE id = $1`,
      values: [committeeId]
    }
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  }

}

module.exports = actions