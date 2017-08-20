var Client = require('mariasql')
require('dotenv').config()

var c  = new Client({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	db: process.env.DB_DATABASE
});

// exports.getResurssit = function(callback) {
// 	console.log('[getResurssit] kutsuttu')
// 	c.query('SELECT * FROM Resurssi', function(err, rows) {
// 	if (err)
// 		throw err
// 	c.end();
// 	console.log('[getResurssit] tietokantayhteys katkaistu')
// 	callback(rows)
// 	});
// }

exports.getResurssit = function(callback) {
	console.log('[getResurssit] kutsuttu')
	c.query('SELECT * FROM Resurssi', function(err, rows) {
	if (err)
		throw err
	c.end();
	console.log('[getResurssit] tietokantayhteys katkaistu')
	callback(null, rows)
	});
}

exports.getPaivamaarat = function(resurssi_id, callback) {
	console.log('[getPaivamaarat] kutsuttu resurssi_id:llä' + resurssi_id)
	c.query(('SELECT DISTINCT paivamaara, resurssi_id FROM Aikarako WHERE resurssi_id = ' + resurssi_id), function(err, rows) {
	if (err)
		throw err
	c.end()
	console.log('[getPaivamaarat] tietokantayhteys päätetty')
	console.log('getpaivamaarat sai rivit: ' + rows)
	console.log('rivillä 0 lukee:' + rows[0].paivamaara + ' resurssi_id on: ' + rows[0].resurssi_id)
	console.log('[getPaivamaarat] kutsutaan callback-funktiota')
	callback(rows)
	});
}