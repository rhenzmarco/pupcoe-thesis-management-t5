const { Pool } = require('pg')

const pool = new Pool({
  database: 'diqbf1p4bp34o',
  user: 'nzmwejyitfnopu',
  password: '1e5b385fae32ff64d0e9fd3c4fd838b8f579798b2693d3befde61066143d8727',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
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