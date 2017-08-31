const express = require('express')
const app = express()
var session = require('express-session')
const bodyParser = require('body-parser')
var dbc = require('./dbcontroller')
const env = require('dotenv').config()
var async = require('async')
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')
app.use(session({
	secret: 'KLQR-541R-PSQslo5',
	resave: true,
	saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var auth = function(req, res, next) {
	console.log('[auth] tunnistaudutaan käyttäjällä: ' + req.session.user)
	console.log('[auth] tunnistaudutaan käyttöoikeudella: ' + req.session.kayttooikeus)
	if(req.session.user == null) {
		console.log('[auth] käyttäjää ei ole määritelty')
		return res.render('kirjaudu')
	}
	dbc.tarkistaKayttajatunnusJaOikeus(req.session.user, req.session.kayttooikeus, function(err, oikeus) {
		if(oikeus) {
			console.log('[auth] if-haara: oikeus sai arvon: ' + oikeus)
			return next()
		}else{
			console.log('[auth] else-haara: oikeus sai arvon: ' + oikeus)
			return res.render('kirjaudu')
		}
	})	
}

app.get('/', auth, function (req, res) {
 	res.render('index', {kayttaja: req.session.kayttajannimi})
})

// app.get('/etusivu', auth, function (req, res) {
//  	res.render('index', {kayttaja: req.session.user})
// })

app.get('/resurssit', auth, function(req,res) {
	console.log('[get /resurssit] pyydetty')
	console.log('[get /resurssit] parametrillä: ' + req.query.toiminto)
	console.log('[get /resurssit] kyselee käyttäjä: ' + req.session.user)
	dbc.getResurssit(function(err, rows) {
		if (err) {
			console.log('Tietokantaoperaatio epäonnistui')
		}
		if(req.query.toiminto === 'muokkaa'){
			res.render('resurssit', { resurssit: rows, action: '/muokkaaresurssia'} )
		}else if(req.query.toiminto === 'varaa') {
			res.render('resurssit', { resurssit: rows, action: '/resurssi'} )
		}
	})
})

// app.get('/kirjaudu', auth, function(req,res) {
// 	res.render('index', {kayttaja: req.session.user})
// })

app.post('/', function (req, res) {
	console.log('Yritetään kirjautu salasanalla: ' + req.body.username +' ja käyttäjätunnuksella: ' + req.body.password)
	if(!req.body.username || !req.body.password) {
		res.render('kuittaus', {viesti: 'Käyttäjätunnusta tai salasanaa ei syötetty.'})
	}else{
		dbc.tunnistaKayttaja(req.body.username, req.body.password, function(err, data) {
			if(data) {
				req.session.user = req.body.username
				req.session.kayttajannimi = data[0].nimi
				console.log("[/] sessiota käyttävän henkilön nimi :" + req.session.kayttajannimi)
				req.session.kayttaja_id = data[0].id
				console.log("[/] sessiota käyttävän henkilön id: " + req.session.kayttaja_id)
				console.log('[/] sessiota käyttää: ' + req.session.user)
				req.session.kayttooikeus = data[0].kayttooikeus
				console.log('[/] sessiolla käyttöoikeus: ' + req.session.kayttooikeus)
				res.render('index', {kayttaja: req.session.kayttajannimi})
			}else{
				res.send('Ei pääsyä')
			}
		})
	}
})

app.get('/logout', function (req, res) {
	console.log('[/logout] käyttäjä kirjautui ulos: ' + req.session.user)
	req.session.destroy();
	res.redirect('/')
})

app.post('/luoresurssi', auth, function (req, res) {
	console.log(req.body)
	console.log('Pitäisi tulostua resurssin nimi: ' + req.body.resurssinnimi)
	dbc.luoUusiResurssi(req.body, function(err) {
		if(err) {
			res.render('kuittaus', {viesti: 'Resurssin luonti epäonnistui.'})
		}else{
			res.render('kuittaus', {viesti: 'Resurssin luonti onnistui.'})
		}
	})

})

app.get('/resurssilistaus', auth, function (req, res) {
		dbc.getResurssit(function(err, rows) {
		if (err) {
			console.log('Tietokantaoperaatio epäonnistui')
		}
		res.render('resurssilistaus', { resurssit: rows })
	})
	
})

app.get('/luoresurssi', auth, function (req, res) {
	res.render('luoresurssi')
})

app.get('/muokkaaresurssia', auth, function (req, res) {
	console.log('/muokkaaresurssia pyydetty: ' + req.query.id)
	dbc.getOneResurssi(req.query.id, function(err, resurssi) {
		res.render('muokkaaresurssia', { resurssi: resurssi })
	})
})

app.post('/muokkaaresurssia', auth, function (req, res) {
	console.log('[POST /muokkaaresurssia kutsuttu]')
	dbc.muokkaaResurssia(req.body, function(err) {
		if(err) {
			res.render('kuittaus', {viesti: 'Resurssin muokkaus epäonnistui.'})
		}else{
			res.render('kuittaus', {viesti: 'Resurssin muokkaus onnistui'})
		}
	})
})

app.get('/luokayttaja', auth, function (req, res) {
	console.log('[get /luokayttaja] kutsuttu')
	res.render('luokayttaja')
})

app.get('/aikarakolistaus', auth, function (req, res) {
	console.log('/aikarakolistaus pyydetty')
	dbc.getAllAikaraot(function(err, rows) {
		res.render('aikarakolistaus', {aikaraot: rows})
	})
})

app.get('/vahvista', auth, function(req, res) {
	console.log('[/vahvista] pyydetty id:llä ' + req.query.id)
	dbc.getAikarako(req.query.id, function(err, rows) {
		if(err) {
			res.render('kuittaus', {viesti: 'Toiminto ei onnistunut'})
		}
		console.log('saatiin rivit: ' + rows[0])
		res.render('vahvista', {tiedot: rows[0]})
	})
})

app.post('/vahvista', auth, function(req, res) {
	console.log('[POST /vahvista] kutsuttu, halutaan varata aikarako: ' + req.body.id)
	console.log('[POST /vahvista] kutsuttu parametreillä: ')
	dbc.varaaAikarako(req.body.id, req.session.kayttaja_id, function(err) {
		if(err) {
			res.render('kuittaus', {viesti: 'Varaus ei onnistunut'})
		}else{
			res.render('vahvistettu')
		}
	})
})

app.get('/omatvaraukset', auth, function (req, res) {
	dbc.haeKayttajanVaraukset(req.session.user, function(err, rows) {
		if(err) {
			res.render('kuittaus', { viesti: 'Varauksien haku epäonnistui'})
		}else{
			res.render('omatvaraukset', {varaukset: rows})
		}
	})
}) 

app.post('/poistavaraus', function (req, res) {
	console.log('[/poistavaraus] halutaan poistaa varaus: ' + req.body.id);
	dbc.poistaVaraus(req.body.id, function(err, done) {
		if(err) {
			res.render('kuittaus', {viesti: 'Poisto epäonnistui'})
		}
		if(done) {
			res.render('kuittaus', {viesti: 'Varauksen poisto onnistui!'})
		}
	})
})

app.get('/resurssi', auth, function (req, res) {
	console.log('[GET /resurssi} pyydetty: ' + req.query.id)
	dbc.getPaivamaarat(req.query.id, function(err, rows) {
		console.log('/resurssi sai rivit joista ensimmainen on: ' + rows[1])
		res.render('paivamaarat', {aikaraot: rows, resurssi_id: req.query.id})
	})
})

app.get('/kellonajat', auth, function (req, res) {
	console.log('saatiin resurssi_id: ' + req.query.resurssi_id + ' ja päivämäärä ' + req.query.paivamaara)
	dbc.getResurssinKellonajatPaivalle(req.query.resurssi_id, req.query.paivamaara, function(err, rows) {
		if(err) {
			console.log('palautti virheen')
			res.render('virhe')
			return
		}else{
			res.render('kellonajat', {aikaraot: rows})		
		}
	})
})

app.listen(app.get('port'), function () {	
	console.log('Kuunnellaan porttia', app.get('port'))
})