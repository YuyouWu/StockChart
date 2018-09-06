var express = require('express');

var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Ticker} = require('./models/ticker');
var {User} = require('./models/user');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('StockChart API');
});

//Get a list of tickers
app.get('/portfolio', function (req, res) {
	Ticker.find().then((tickers) =>{
		res.send({tickers});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Add ticker to portfolio
app.post('/addTicker', function (req, res) {
	var ticker = new Ticker({
    ticker: req.body.ticker
  });

	ticker.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
