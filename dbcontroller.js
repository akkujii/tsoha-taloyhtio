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

exports.varaaAikarako = function(aikarako_id, kayttaja_id, callback) {
	console.log('[varaaResurssi] kutsuttu käyttäjällä ' + aikarako_id + ' ja kayttaja_id:llä: ' + kayttaja_id)
	c.query(('INSERT INTO Varaus (aikarako_id, varaaja_id) VALUES ('+ aikarako_id +', ' + kayttaja_id + ')'), function(err, rows) {
		if (err) {
			console.log('[varaaResurssi] virhe ' + err)
			return err
		}
	console.log('[varaaResurssi] saatiin rivit: ' + rows)
	c.end()
	callback(null)
	})	

}

exports.getOneResurssi = function(resurssi_id, callback) {
	console.log('[getOneResurssi] kutsuttu')
	c.query(('SELECT * FROM Resurssi WHERE Resurssi.id = ' + resurssi_id), function(err, rows) {
		if (err) {
			console.log('[getOneResurssi] virhe ' + err)
			return err
		}
	console.log('[getOneResurssi] saatiin rivit: ' + rows)
	c.end()
	callback(null, rows[0])
	})	
}

	// var resurssi = {resurssinnimi: 'testiresurssi',
	// 				kayttoaikaalkaa: '15:00',
	// 				kayttoaikapaattyy: '19:00',
	// 				varausyksikko: '01:00',
	// 				hinta: 1.50}
	// callback(null, resurssi)

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
	c.query(("SELECT id, salasana, kayttooikeus, nimi FROM Kayttaja WHERE kayttajatunnus = '" + kayttajatunnus + "'"), function(err, rows) {
	if (err) {
		console.log('[tunnistaKayttaja] virhe: ' + err)
		return err
	}
	c.end()
	console.log('[tunnistaKayttaja] saatiin rivit: ' + rows[0].salasana + rows[0].kayttooikeus + rows[0].nimi)
	if(rows[0].salasana === salasana) {
		console.log('[tunnistaKayttaja] Salasana oikein')
		callback(null, rows)
	}else{
		console.log('[tunnistaKayttaja] Salasana väärin')
		callback(null, null)
	}
	})
}

exports.muokkaaResurssia = function(tiedot, callback) {
	console.log('[muokkaaResurssia] kutsuttu tiedoilla: ' + Object.getOwnPropertyNames(tiedot))
	c.query(('UPDATE Resurssi SET ' +
			 'resurssinnimi = "' + tiedot.resurssinnimi + '",' +
			 'kayttoaikaalkaa = "' + tiedot.kayttoaikaalkaa + '",' +
			 'kayttoaikapaattyy = "' + tiedot.kayttoaikapaattyy + '",' + 
			 'varausyksikko = "' + tiedot.varausyksikko + '",' +
			 'hinta = ' + tiedot.hinta + 
			 'WHERE id = ' + tiedot.id), function(err, rows) {
		if(err) {
			console.log('[muokkaaResrussia] resurssin muokkaus epäonnistui ' + err)
			callback(err)
		}else{
			callback(null)
		}
	})
}

exports.tarkistaKayttajatunnusJaOikeus = function(kayttajatunnus, kayttooikeus, callback) {
	console.log('[tarkistaKayttajatunnusJaOikeus] kutsuttu käyttäjätunnus-kayttoikeus-parilla ' + kayttajatunnus + kayttooikeus)
	c.query(("SELECT kayttooikeus FROM Kayttaja WHERE kayttajatunnus = '" + kayttajatunnus + "'"), function(err, rows) {
	if (err) {
		console.log('[tarkistaKayttajatunnusJaOikeus] virhe, ei käyttoikeutta: ' + err)
		callback(null, false)
	}
	//c.end()
	console.log('[tarkistaKayttajatunnusJaOikeus] saatiin rivit: ' + rows[0].kayttooikeus)
	if(rows[0].kayttooikeus === kayttooikeus) {
		callback(null, true)
	}
	})
}

exports.haeKayttajanVaraukset = function(kayttajatunnus, callback) {
	console.log('[haeKayttajanVaraukset] kutsuttu käyttäjätunnuksella: '+ kayttajatunnus)
	c.query(("SELECT Kayttaja.kayttajatunnus, Varaus.id, Aikarako.paivamaara, Aikarako.kellonaika, " + 
		"Resurssi.resurssinnimi FROM Varaus " + 
		"LEFT JOIN Kayttaja ON Varaus.varaaja_id = Kayttaja.id " +
		"LEFT JOIN Aikarako ON Aikarako.id = Varaus.aikarako_id " +
		"LEFT JOIN Resurssi ON Aikarako.resurssi_id = Resurssi.id " + 
		"WHERE kayttajatunnus = '" + kayttajatunnus + "'"), 
		function(err, rows) {
		if (err) {
			console.log('[haeKayttajanVaraukset] kysely epäonnistui: ' + err)
			callback(null, null)
		}
		callback(null, rows)
	})
}

exports.luoUusiResurssi = function(tiedot, callback) {
	var kysely = 'INSERT INTO Resurssi (resurssinnimi, kayttoaikaalkaa, kayttoaikapaattyy, varausyksikko, hinta) VALUES ' + '("' + tiedot.resurssinnimi + '", "' + tiedot.kayttoaikaalkaa + '", "' + tiedot.kayttoaikapaattyy + '", "' + tiedot.varausyksikko + '", ' + tiedot.hinta + ')'
	console.log('kysely näyttää tältä: '+ kysely)
	c.query(kysely, function(err, rows) {
    	if(err) {
    		console.log('[luoUusiResurssi] resurssin luonti epäoinnistui')
    		callback('virhe')
    	}
   		callback(null)
	})
}


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