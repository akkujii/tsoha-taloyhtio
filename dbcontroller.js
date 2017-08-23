var Client = require('mariasql')
require('dotenv').config()

var c  = new Client({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	db: process.env.DB_DATABASE
});

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

exports.getAllAikaraot = function(callback) {
	console.log('[getAllAikaraot] kutsuttu')
	c.query('SELECT resurssinnimi, paivamaara, kellonaika FROM Aikarako LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id', function(err, rows) {
	if (err)
		throw err
	c.end();
	console.log('[getAllAikaraot] tietokantayhteys katkaistu')
	callback(null, rows)
	});

}

exports.getPaivamaarat = function(resurssi_id, callback) {
	console.log('[getPaivamaarat] kutsuttu resurssi_id:llä ' + resurssi_id)
	c.query(('SELECT DISTINCT paivamaara, resurssi_id FROM Aikarako WHERE resurssi_id = ' + resurssi_id), function(err, rows) {
	if (err) {
		console.log('Tuli virhe: ' + err)
		throw err
	}
	c.end()
	console.log('[getPaivamaarat] tietokantayhteys päätetty')
	console.log('getpaivamaarat sai rivit: ' + rows)
	console.log('rivillä 0 lukee:' + rows[0].paivamaara + ' resurssi_id on: ' + rows[0].resurssi_id)
	console.log('[getPaivamaarat] kutsutaan callback-funktiota')
	callback(null, rows)
	})
}

exports.getAikarako = function(id, callback) {
	console.log('[getPaivamaarat] kutsuttu resurssi_id:llä ' + id)
	c.query(('SELECT Aikarako.id, Aikarako.paivamaara, Aikarako.kellonaika, Aikarako.kesto, Resurssi.resurssinnimi, Resurssi.hinta FROM Aikarako LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id WHERE Aikarako.id = ' + id), function(err, rows) {
	if (err) {
		console.log('Tuli virhe: ' + err)
		throw err
	}
	c.end()
	console.log('getAikarako saatiin rivit: ' + rows[0].resurssinnimi)
	callback(null, rows)
	})
}

exports.getResurssinKellonajatPaivalle = function(resurssi_id, paivamaara, callback) {
	console.log('[getResurssinKellonajatPaivalle] kutsuttu resurssi_id:llä: ' + resurssi_id + ' ja päivämäärällä: ' + paivamaara)
	c.query(('SELECT Aikarako.id, Aikarako.kellonaika, Aikarako.paivamaara FROM Aikarako LEFT JOIN Varaus ON Aikarako.id = Varaus.aikarako_id WHERE Varaus.aikarako_id IS NULL AND Aikarako.resurssi_id = ' + resurssi_id + ' AND Aikarako.paivamaara = "' + paivamaara + '"'), function(err, rows) {
	if (err) {
		console.log('Tuli virhe: ' + err)
		throw err
	}
	c.end()
	callback(null, rows)
	})
}

exports.getKellonajat = function(resurssi_id, paivamaara, callback) {
	console.log('[getKellonajat] kutsuttu paivamaaralla: ' + paivamaara + ' ja resurssi_id:llä: ' + resurssi_id)
	c.query(('SELECT resurssi_id, kellonaika FROM Aikarako WHERE paivamaara =  ' + paivamaara + ' AND resurssi_id = ' + resurssi_id), function (err, rows) {
	if (err) {
		console.log('Tuli virhe: ' + err)
		throw err
	}
	c.end()
	callback(null, rows)
	})
}