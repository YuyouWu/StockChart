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

//Get Portfolio[]
app.get('/portfolio', function (req, res) {
	res.send(portfolio);
});

//Add ticker to portfolio
app.post('/addTicker', function (req, res) {
	var body = _.pick(req.body, 'ticker');

	if (!_.isString(body.ticker) || body.ticker.trim().length === 0) {
		return res.status(400).send();
	}

	body.ticker = body.ticker.trim();
  body.id = stockNextId++;

	portfolio.push(body);
	res.json(portfolio);
});

//Delete a ticker from portfolio[] with id
app.delete('/portfolio/:id', function (req, res) {
  var tickerId = parseInt(req.params.id, 10);
	var matchedTicker = _.findWhere(portfolio, {id: tickerId});
  if (!matchedTicker) {
    res.status(404).json({"error": "no Stock found with that id"});
  } else {
    portfolio = _.without(portfolio, matchedTicker);
    res.json(matchedTicker);
  }
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
