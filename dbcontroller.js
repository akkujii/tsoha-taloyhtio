var Client = require('mariasql')
require('dotenv').config()

var c  = new Client({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	db: process.env.DB_DATABASE
});

exports.getResurssit = function() {
	c.query('SELECT * FROM Resurssi', function(err, rows) {
	if (err)
		throw err;
	c.end();
	return rows
	});
}