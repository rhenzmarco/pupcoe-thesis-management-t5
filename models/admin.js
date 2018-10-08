const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const user = require('./users.js')

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
  },

  getClassList: (callback) => {
    const query = {
      text: `SELECT * FROM class INNER JOIN users ON users.id = class.advisor_id ORDER BY batch DESC, section ASC`
    }
    db.query(query).then(data => {
      callback(data.rows)
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  }



}

module.exports = actions