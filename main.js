const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//var Client = require('mariasql')
var dbc = require('./dbcontroller')
const env = require('dotenv').config()
var async = require('async')

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
 	res.render('index')
})

app.get('/resurssit', function(req,res) {
	console.log('[get /resurssit] pyydetty')
	dbc.getResurssit(function(err, rows) {
		if (err) {
			console.log('Tietokantaoperaatio epäonnistui')
		}
		res.render('resurssit', {resurssit: rows})
	})
})

app.post('/luoresurssi', function (req, res) {
	console.log(req.body)
})

app.get('/luoresurssi', function (req, res) {
	res.render('luoresurssi')
})

app.get('/muokkaaresurssia', function (req, res) {
	res.render('muokkaaresurssia')
})

app.post('/muokkaaresurssia', function (req, res) {
	console.log(req.body)
})

app.get('/luokayttaja', function (req, res) {
	console.log('[get /luokayttaja] kutsuttu')
	res.render('luokayttaja')
})

app.get('/aikarakolistaus', function (req, res) {
	console.log('/aikarakolistaus pyydetty')
	dbc.getAllAikaraot(function(err, rows) {
		res.render('aikarakolistaus', {aikaraot: rows})
	})
})

app.get('/vahvista', function(req, res) {
	console.log('[/vahvista] pyydetty id:llä ' + req.query.id)
	dbc.getAikarako(req.query.id, function(err, rows) {
		if(err) {
			res.render('virhe')
		}
		console.log('saatiin rivit: ' + rows[0])
		res.render('vahvista', {tiedot: rows[0]})
	})
})

app.post('/vahvista', function(req, res) {
	console.log('[POST /vahvista] kutsuttu, halutaan varata aikarako: ' + req.body.id)
	// TODO toteuta dbcontrolleriin varauksen lisäys
	res.render('vahvistettu')

})

app.get('/resurssi', function (req, res) {
	console.log('[GET /resurssi} pyydetty: ' + req.query.id)
	dbc.getPaivamaarat(req.query.id, function(err, rows) {
		console.log('/resurssi sai rivit joista ensimmainen on: ' + rows[1])
		res.render('paivamaarat', {aikaraot: rows, resurssi_id: req.query.id})
	})
})

app.get('/kellonajat', function (req, res) {
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

app.get('/yksittaisvaraus', function (req, res) {
	res.render('valikko', { teksti: 'Ysittäisvaraus: valitse resurssi', toiminnot: resurssit })
})

app.listen(app.get('port'), function () {	
	console.log('Kuunnellaan porttia', app.get('port'))
})