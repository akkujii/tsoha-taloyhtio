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
	if (err) {
		console.log('[getResurssit] virhe: ' + error)
		return err
	}
	c.end();
	console.log('[getResurssit] tietokantayhteys katkaistu')
	callback(null, rows)
	});
}

exports.getAllAikaraot = function(callback) {
	console.log('[getAllAikaraot] kutsuttu')
	c.query('SELECT resurssinnimi, paivamaara, kellonaika FROM Aikarako LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id', function(err, rows) {
	if (err) {
		console.log('[getAllAikaraot] virhe: ' + error)
		return err
	}
	c.end();
	console.log('[getAllAikaraot] tietokantayhteys katkaistu')
	callback(null, rows)
	});

}

exports.getPaivamaarat = function(resurssi_id, callback) {
	console.log('[getPaivamaarat] kutsuttu resurssi_id:llä ' + resurssi_id)
	c.query(('SELECT DISTINCT paivamaara, resurssi_id FROM Aikarako WHERE resurssi_id = ' + resurssi_id), function(err, rows) {
	if (err) {
		console.log('[getPaivamaarat] virhe: ' + err)
		return err
	}
	c.end()
	callback(null, rows)
	})
}

exports.getAikarako = function(id, callback) {
	console.log('[getPaivamaarat] kutsuttu resurssi_id:llä ' + id)
	c.query(('SELECT Aikarako.id, Aikarako.paivamaara, Aikarako.kellonaika, Aikarako.kesto, Resurssi.resurssinnimi, Resurssi.hinta FROM Aikarako LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id WHERE Aikarako.id = ' + id), function(err, rows) {
	if (err) {
		console.log('[getAIkarako]  virhe: ' + err)
		return err
	}
	c.end()
	console.log('getAikarako saatiin rivit: ' + rows[0].resurssinnimi)
	callback(null, rows)
	})
}

exports.tunnistaKayttaja = function(kayttajatunnus, salasana, callback) {
	console.log('[tunnistaKayttaja] kutsuttu käyttäjätunnuksella ' + kayttajatunnus)
	c.query(("SELECT salasana FROM Kayttaja WHERE kayttajatunnus = '" + kayttajatunnus + "'"), function(err, rows) {
	if (err) {
		console.log('[tunnistaKayttaja] virhe: ' + err)
		return err
	}
	c.end()
	console.log('[tunnistaKayttaja] saatiin rivit: ' + rows[0].salasana)
	if(rows[0].salasana === salasana) {
		console.log('[tunnistaKayttaja] Salasana oikein')
		callback(null, true)
	}else{
		console.log('[tunnistaKayttaja] Salasana väärin')
		callback(null, false)
	}
	})
}

// exports.tunnistaKayttaja = function(kayttajatunnus, salasana, callback) {
// 	console.log('[tunnistaKayttaja] kutsuttu käyttäjätunnuksella ' + kayttajatunnus + ' ja salasanalla ' + salasana)
// 	c.query(('SELECT salasana FROM Kayttaja WHERE kayttajatunnus = :id'), {id: kayttajatunnus}, function(err, rows) {
// 		if(err) {
// 			console.log('tietokantaoperaatio epäonnistui')
// 		}
// 	})
// 	c.end()
// 	console.log('saatiin rivit ' + rows)
// 	if(rows.salasana === salasana) {
// 		callback(null, true)
// 	}else{
// 		callback(null, false) 
// 	}
// }

exports.getResurssinKellonajatPaivalle = function(resurssi_id, paivamaara, callback) {
	console.log('[getResurssinKellonajatPaivalle] kutsuttu resurssi_id:llä: ' + resurssi_id + ' ja päivämäärällä: ' + paivamaara)
	c.query(('SELECT Aikarako.id, Aikarako.kellonaika, Aikarako.paivamaara FROM Aikarako LEFT JOIN Varaus ON Aikarako.id = Varaus.aikarako_id WHERE Varaus.aikarako_id IS NULL AND Aikarako.resurssi_id = ' + resurssi_id + ' AND Aikarako.paivamaara = "' + paivamaara + '"'), function(err, rows) {
	if (err) {
		console.log('[getResurssinKellonajatPaivalle] virhe: ' + err)
		callback(err, null)
	}
	c.end()
	callback(null, rows)
	})
}

exports.getKellonajat = function(resurssi_id, paivamaara, callback) {
	console.log('[getKellonajat] kutsuttu paivamaaralla: ' + paivamaara + ' ja resurssi_id:llä: ' + resurssi_id)
	c.query(('SELECT resurssi_id, kellonaika FROM Aikarako WHERE paivamaara =  ' + paivamaara + ' AND resurssi_id = ' + resurssi_id), function (err, rows) {
	if (err) {
		console.log('[getKellonajat] virhe ' + err)
		return err
	}
	c.end()
	callback(null, rows)
	})
}