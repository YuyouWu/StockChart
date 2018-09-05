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

	if (!_.isString(body.ticker) || body.ticker.trim().length === 0) {
		return res.status(400).send();
	}

	body.ticker = body.ticker.trim();
	portfolio.push(body);
	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
