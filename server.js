var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var portfolio = [];

app.get('/', function (req, res) {
	res.send('StockChart API');
});

app.get('/portfolio', function (req, res) {
	res.send('List of stock in a portfolio');
});

app.post('/addStock', function (req, res) {
	var body = _.pick(req.body, 'ticker');

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
