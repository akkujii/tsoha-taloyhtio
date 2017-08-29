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

// Authentication & Authorization Middleware
var auth = function(req, res, next) {
	if (req.session && req.session.user === 'ilpo57' && req.session.kayttooikeus)
		return next()
	else
		return res.send('Ei pääsyä (401) Sinun tulee olla kirjautunut järjestelmään')
}

app.get('/', function (req, res) {
 	res.render('kirjaudu')
})

app.get('/etusivu', auth, function (req, res) {
 	res.render('index')
})

app.get('/resurssit', auth, function(req,res) {
	console.log('[get /resurssit] pyydetty')
	console.log('[get /resurssit] kyselee käyttäjä: ' + req.session.user)
	dbc.getResurssit(function(err, rows) {
		if (err) {
			console.log('Tietokantaoperaatio epäonnistui')
		}
		res.render('resurssit', {resurssit: rows})
	})
})

app.post('/kirjaudu', function (req, res) {
	console.log('Yritetään kirjautu salasanalla: ' + req.body.username +' ja käyttäjätunnuksella: ' + req.body.password)
	if(!req.body.username || !req.body.password) {
		res.send('Käyttäjätunnusta tai salasanaa ei syötetty')
	}else{
		dbc.tunnistaKayttaja(req.body.username, req.body.password, function(err, kayttooikeus) {
			if(kayttooikeus) {
				req.session.user = req.body.username
				console.log('sessiota käyttää: ' + req.session.user)
				req.session.kayttooikeus = kayttooikeus
				console.log('sessiolla käyttöoikeus: ' + req.session.kayttooikeus)
				res.render('index')
			}else{
				res.send('Ei pääsyä')
			}
		})
	}
})

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.send('Uloskirjautuminen onnistui')
})

app.post('/luoresurssi', auth, function (req, res) {
	console.log(req.body)
})

app.get('/luoresurssi', auth, function (req, res) {
	res.render('luoresurssi')
})

app.get('/muokkaaresurssia', auth, function (req, res) {
	res.render('muokkaaresurssia')
})

app.post('/muokkaaresurssia', auth, function (req, res) {
	console.log(req.body)
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
			res.render('virhe')
		}
		console.log('saatiin rivit: ' + rows[0])
		res.render('vahvista', {tiedot: rows[0]})
	})
})

app.post('/vahvista', auth, function(req, res) {
	console.log('[POST /vahvista] kutsuttu, halutaan varata aikarako: ' + req.body.id)
	// TODO toteuta dbcontrolleriin varauksen lisäys
	res.render('vahvistettu')

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