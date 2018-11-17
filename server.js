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
var {Portfolio} = require('./models/Portfolio');

var {authenticate} = require('./middleware/authenticate');

var app = express();
var PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

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
  //set new index based on how many tickers a user have
  Ticker.find({
    _creator: req.user._id
  }).then((tickers) =>{

    //create new ticker obj with new index
    var ticker = new Ticker({
      ticker: req.body.ticker,
      quantity: req.body.quantity,
      _creator: req.user._id,
      portfolioName: req.body.portfolioName,
      index: tickers.length
    });
    ticker.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
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

//Update index of one tickers from a user
app.patch('/api/portfolio/index', authenticate, (req, res) =>{
  var body = _.pick(req.body, ['_id', 'index']);
  var id = body._id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Ticker.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }
    res.send({ticker});
  }).catch((e) => {
    res.status(400).send();
  })
});

////////////////////////
//PORTFOLIO MANAGEMENT//
////////////////////////

//Get all portfolios from a user
app.get('/api/allPortfolio/', authenticate, (req, res) => {
	Portfolio.find({
    _creator: req.user._id
  }).then((portfolio) =>{
		res.send({portfolio});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Create new Portfolio
app.post('/api/newPortfolio/', authenticate, (req, res) => {
    var portfolio = new Portfolio({
      portfolioName: req.body.portfolioName,
      _creator: req.user._id
    });

    portfolio.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

//Delete Portfolio
app.delete('/api/deletePortfolio/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Portfolio.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((portfolio) => {
    if (!portfolio) {
      return res.status(404).send();
    }

    //TODO: Delete tickers inside this portfolio

    res.send({portfolio});
  }).catch((e) => {
    res.status(400).send();
  });
});

//Rename Portfolio
app.patch('/api/renamePortfolio/', authenticate, (req, res) =>{
  var body = _.pick(req.body, ['_id', 'portfolioName']);
  var id = body._id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Portfolio.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((portfolio) => {
    if (!portfolio) {
      return res.status(404).send();
    }

    //TODO: update tickers' portfolio name 

    res.send({portfolio});
  }).catch((e) => {
    res.status(400).send();
  })
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

//Get current user
app.get('/api/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//Find user by email
app.post('/api/users/email', (req, res) => {
  var body = req.body;
  User.findOne({email: body.email}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.send(body.email);
  }).catch((e) => {
    res.status(400).send();
  });
});


app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
	console.log('Express listening on port ' + PORT + '!');
});
