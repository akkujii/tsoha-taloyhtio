const express = require('express')
const app = express()

app.get('/', function (req, res) {
	res.send('Terve!')
})

app.listen(3000, function () {
	console.log('Kuunnellaan porttia 3000')
})