const express = require('express');
const _ = require('lodash');
const path = require("path");

const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');
// const yahooFinance = require('yahoo-finance');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
mongoose.set('useCreateIndex', true);

var {Ticker} = require('./models/ticker');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('StockChart API');
});

//Get a list of tickers inside portfolio with authentication
app.get('/api/portfolio', authenticate, (req, res) => {
	Ticker.find({
    _creator: req.user._id
  }).then((tickers) =>{
		res.send({tickers});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Get a specific ticker
app.get('/api/portfolio/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Ticker.findById(id).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }

    res.send({ticker});
  }).catch((e) => {
    res.status(400).send();
  });
});

//Add ticker to portfolio
app.post('/api/portfolio/add', authenticate, (req, res) => {
	var ticker = new Ticker({
    ticker: req.body.ticker,
    quantity: req.body.quantity,
    _creator: req.user._id
  });

	ticker.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

//Delete ticker inside portfolio
app.delete('/api/portfolio/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Ticker.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }

    res.send({ticker});
  }).catch((e) => {
    res.status(400).send();
  });
});


///////////////////
//USER MANAGEMENT//
///////////////////

// Add New User
app.post('/api/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('xauth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//User Login
app.post('/api/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('xauth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//User Logout
app.delete('/api/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

//Get a specific user
app.get('/api/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
	console.log('Express listening on port ' + PORT + '!');
});
