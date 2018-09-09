var express = require('express');
const _ = require('lodash');

var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Ticker} = require('./models/ticker');
var {User} = require('./models/user');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('StockChart API');
});

//Get a list of tickers
app.get('/portfolio', (req, res) =>{
	Ticker.find().then((tickers) =>{
		res.send({tickers});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Add ticker to portfolio
app.post('/addTicker', (req, res) => {
	var ticker = new Ticker({
    ticker: req.body.ticker
  });

	ticker.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.listen(PORT, () => {
	console.log('Express listening on port ' + PORT + '!');
});
