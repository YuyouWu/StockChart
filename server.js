const express = require('express');
const _ = require('lodash');

const bodyParser = require('body-parser');
const request = require('request');
const CircularJSON = require('circular-json');
// const yahooFinance = require('yahoo-finance');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
mongoose.set('useCreateIndex', true);

var {Ticker} = require('./models/ticker');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var PORT = process.env.PORT || 5000;
var AlphaVantageAPI = process.env.AlphaVantageAPI;

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('StockChart API');
});

//Get a list of tickers inside portfolio with authentication
app.get('/portfolio', authenticate, (req, res) => {
	Ticker.find({
    _creator: req.user._id
  }).then((tickers) =>{
		res.send({tickers});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Get a specific ticker
app.get('/portfolio/:id', (req, res) => {
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
app.post('/portfolio/add', authenticate, (req, res) => {
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
app.delete('/portfolio/:id', authenticate, (req, res) => {
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

//Get stock price - Daily
app.get('/portfolio/:id/price', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Ticker.findById(id).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }
    reqString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker.ticker+'&apikey=' + AlphaVantageAPI;
    console.log(reqString);
    request(reqString, { json: true }, (err, response, body) => {
      if (err) { 
        return console.log(err); 
      }
      let priceData = body["Time Series (Daily)"];
      res.send(priceData[Object.keys(priceData)[0]]["4. close"]);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

///////////////////
//USER MANAGEMENT//
///////////////////

// Add New User
app.post('/users', (req, res) => {
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
app.post('/users/login', (req, res) => {
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
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

//Get a specific user
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
	console.log('Express listening on port ' + PORT + '!');
});
