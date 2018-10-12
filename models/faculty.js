const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const user = require('./users.js')
const _ = require('lodash')
var actions = {
  getClassData: (id, callback) => {
    const query = {
      text: `SELECT * FROM class WHERE advisor_id = ${id}`
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
  }

}

module.exports = actions