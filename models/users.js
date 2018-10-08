const db = require('../db/index.js')

var actions = {
  getById: (id,callback) => {
    const query = {
      text: `Select * FROM users 
      WHERE users.id = '${id}'`,
    }
    db.query(query)
    .then(res => callback(res.rows[0]))
    .catch(e => callback(e))
  },
  getByUsername: (username,callback) => {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    }
    db.query(query)
    .then(data => callback(data.rows[0]))
    .catch(e => callback(e))
  },
  getByEmail: (email, callback) => {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    }
    db.query(query).then(data => {
      callback(data.rows[0])
    }).catch(e => callback(e))
  }
}

module.exports = actions