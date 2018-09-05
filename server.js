var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

var portfolio = [];
var stockNextId = 1;

app.get('/', function (req, res) {
	res.send('StockChart API');
});

app.get('/portfolio', function (req, res) {
	res.send(portfolio);
});

app.post('/addStock', function (req, res) {
	var body = _.pick(req.body, 'ticker');
  console.log(body);
	if (!_.isString(body.ticker) || body.ticker.trim().length === 0) {
		return res.status(400).send();
	}

	body.ticker = body.ticker.trim();
  body.id = stockNextId++;

	portfolio.push(body);
	res.json(portfolio);
});

app.delete('/stock/:id', function (req, res) {
  var stockId = parseInt(req.params.id, 10);
	var matchedStock = _.findWhere(portfolio, {id: stockId});
  console.log(matchedStock);
  if (!matchedStock) {
    res.status(404).json({"error": "no Stock found with that id"});
  } else {
    portfolio = _.without(portfolio, matchedStock);
    res.json(matchedStock);
  }
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
