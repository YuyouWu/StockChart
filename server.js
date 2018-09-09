const express = require('express');
const _ = require('lodash');

const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
mongoose.set('useCreateIndex', true);

var {Ticker} = require('./models/ticker');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

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

app.delete('/portfolio/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Ticker.findByIdAndRemove(id).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }

    res.send({ticker});
  }).catch((e) => {
    res.status(400).send();
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

//Get /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
	console.log('Express listening on port ' + PORT + '!');
});
