var Client = require('mariasql');

var c = new Client({
	host: 'localhost',
	user: 'testikayttaja',
	password: 'salasana',
	db: 'resurssit'
});

c.query('SELECT * FROM Resurssit', function(err, rows) {
	if (err)
		throw err;
	console.dir(rows);
});

c.end();