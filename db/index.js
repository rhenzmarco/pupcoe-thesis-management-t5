const { Pool } = require('pg')

const pool = new Pool({
  database: 'de7s93dhq1as5o',
  user: 'qhwxnwrssnzetj',
  password: 'd38372b82a398fe12c63b3e6fc8ae80d4947b6f511c3031d75a438489798aee6',
  host: 'ec2-184-73-197-211.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
})

pool.connect().then(function() {
	console.log('connected to database')
}).catch(e => {
	if (e) {
		console.log('cannot connect to database')
	}
})

module.exports = {
	query: (text, callback) => {
		return pool.query(text, callback)
	}
}