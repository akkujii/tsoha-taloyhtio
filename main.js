const express = require('express')
const app = express()
app.set('view engine', 'pug')

var toiminnot = ['Tee yksittäinen varaus', 'Varaa vakiokaika', 'Muokkaa varauksia', 
				 'Varausten yhteenveto', 'Salasanan vaihto', 'Kirjaudu ulos']

app.get('/', function (req, res) {
 	res.render('paavalikko', {toiminnot})
})

app.listen(3000, function () {	
	console.log('Kuunnellaan porttia 3000')
})