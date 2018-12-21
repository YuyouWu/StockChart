const express = require('express');
const _ = require('lodash');
const path = require("path");
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');
const schedule = require('node-schedule');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
mongoose.set('useCreateIndex', true);

var { Ticker } = require('./models/ticker');
var { User } = require('./models/user');
var { Portfolio } = require('./models/portfolio');
var { Screener } = require('./models/screener');

var { authenticate } = require('./middleware/authenticate');

var app = express();
var PORT = process.env.PORT || 5000;

app.use(bodyParser.json({
  limit: '50mb'
}));

//Get a list of tickers inside portfolio with authentication
app.get('/api/portfolio', authenticate, (req, res) => {
  Ticker.find({
    _creator: req.user._id
  }).then((tickers) => {
    res.send({ tickers });
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

    res.send({ ticker });
  }).catch((e) => {
    res.status(400).send();
  });
});

//Add ticker to portfolio
app.post('/api/portfolio/add', authenticate, (req, res) => {
  //set new index based on how many tickers a user have
  Ticker.find({
    _creator: req.user._id
  }).then((tickers) => {

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

    res.send({ ticker });
  }).catch((e) => {
    res.status(400).send();
  });
});

//Update index of one tickers from a user
app.patch('/api/portfolio/index', authenticate, (req, res) => {
  var body = _.pick(req.body, ['_id', 'index']);
  var id = body._id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Ticker.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((ticker) => {
    if (!ticker) {
      return res.status(404).send();
    }
    res.send({ ticker });
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
  }).then((portfolio) => {
    res.send({ portfolio });
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

    res.send({ portfolio });
  }).catch((e) => {
    res.status(400).send();
  });
});

//Rename Portfolio
app.patch('/api/renamePortfolio/', authenticate, (req, res) => {
  var body = _.pick(req.body, ['_id', 'portfolioName']);
  var id = body._id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Portfolio.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((portfolio) => {
    if (!portfolio) {
      return res.status(404).send();
    }

    //TODO: update tickers' portfolio name 

    res.send({ portfolio });
  }).catch((e) => {
    res.status(400).send();
  })
});

////////////
//Screener//
////////////

//Add all tickers to screener model
app.post('/api/screener/', (req, res) => {
  Screener.collection.drop();
  var symbolArr = [];
  var symbolChunk = '';
  try {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols').then(result => {
      var screenerDataArr = result.data;
      var chunk = 100;
      var j = 0;
      for (var i = 0; i < screenerDataArr.length; i = i + chunk) {
        symbolArr[j] = screenerDataArr.slice(i, i + chunk); //Slice into chunks of 100 
        j++;
      }
      console.log(screenerDataArr.length);
      return symbolArr;
    }).then(arr => {
      for (var i = 0; i < arr.length; i++) {
        symbolChunk = '';
        arr[i].forEach(element => {
          symbolChunk = symbolChunk + element.symbol + ','
        });
        axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbolChunk + '&types=quote,stats').then(stat => {
          for (key in stat.data) {
            if (stat.data.hasOwnProperty(key)) {
              //Calculate other data needed for querying 
              var tempDay50SMAtoPrice = (stat.data[key].stats.day50MovingAvg - stat.data[key].quote.latestPrice)/stat.data[key].quote.latestPrice;
              var tempDay200SMAtoPrice = (stat.data[key].stats.day200MovingAvg - stat.data[key].quote.latestPrice)/stat.data[key].quote.latestPrice;
              var tempDay50SMAtoDay200SMA = (stat.data[key].stats.day50MovingAvg - stat.data[key].stats.day200MovingAvg)/stat.data[key].stats.day200MovingAvg; 
              var tempDay200SMAtoDay50SMA = (stat.data[key].stats.day200MovingAvg - stat.data[key].stats.day50MovingAvg)/stat.data[key].stats.day50MovingAvg;

              var otherData = {
                day50SMAAbovePrice: null,
                day200SMAAbovePrice: null,
                day50SMAAboveDay200SMA: null,
                day50SMAtoPrice: null,
                day200SMAtoPrice: null,
                day50SMAtoDay200SMA: null,
                day200SMAtoDay50SMA: null
              }
              
              if (stat.data[key].stats.day50MovingAvg > stat.data[key].quote.latestPrice){
                otherData.day50SMAAbovePrice = true
              } else {
                otherData.day50SMAAbovePrice = false
              }

              if (stat.data[key].stats.day200MovingAvg > stat.data[key].quote.latestPrice){
                otherData.day200SMAAbovePrice = true
              } else {
                otherData.day200SMAAbovePrice = false
              }

              if (stat.data[key].stats.day50MovingAvg > stat.data[key].stats.day200MovingAvg){
                otherData.day50SMAAboveDay200SMA = true
              } else {
                otherData.day50SMAAboveDay200SMA = false
              }

              if(isNaN(tempDay50SMAtoPrice) === false){
                otherData.day50SMAtoPrice = tempDay50SMAtoPrice;
              }

              if(isNaN(tempDay200SMAtoPrice) === false){
                otherData.day200SMAtoPrice = tempDay200SMAtoPrice;
              }

              if(isNaN(tempDay50SMAtoDay200SMA) === false){
                otherData.day50SMAtoDay200SMA = tempDay50SMAtoDay200SMA;
              }

              if(isNaN(tempDay200SMAtoDay50SMA) === false){
                otherData.day200SMAtoDay50SMA = tempDay200SMAtoDay50SMA;
              }

              //Joining stats and quotes then saving to Screener Model
              var statsAndQuote = Object.assign({}, stat.data[key].stats, stat.data[key].quote, otherData);
              var statData = new Screener(statsAndQuote);
              statData.save().then(() => {
              }).catch(e => {
                if (e.errors.symbol.message !== "Path `symbol` is required."){
                  console.log(e);
                }
              });
            }
          }
        }).catch(e => {
          //console.log(e);
        });
      };
      console.log('Screener Data Saved');
      res.status(200).send();
    }).catch(e => {
      //console.log(e);
    });
  } catch (e) {
    res.status(400).send();
  }
});

//Filer Screener Data
app.post('/api/filterScreener', (req, res) => {
  //filter results here
  var body = _.pick(req.body, ['marketcap', 'dividendYield', 'EPSSurprisePercent', 'beta', 'peRatio', 'day50MovingAvg','day200MovingAvg','week52high','week52low']);
  //Query for Market Cap
  var QmarketCap = { $exists: true }
  if (body.marketcap === 'nanocap') {
    QmarketCap = {
      $lte: 50000000
    }
  } else if (body.marketcap === 'microcap') {
    QmarketCap = {
      $gte: 50000000,
      $lte: 300000000
    }
  } else if (body.marketcap === 'smallcap') {
    QmarketCap = {
      $gte: 300000000,
      $lte: 2000000000
    }
  } else if (body.marketcap === 'midcap') {
    QmarketCap = {
      $gte: 2000000000,
      $lte: 10000000000
    }
  } else if (body.marketcap === 'largecap') {
    QmarketCap = {
      $gte: 10000000000,
      $lte: 300000000000
    }
  } else if (body.marketcap === 'megacap') {
    QmarketCap = {
      $gte: 300000000000,
    }
  }

  //Query for dividend yield
  var QdividendYield = { $exists: true }
  if (body.dividendYield === 'none') {
    QdividendYield = 0
  } else if (body.dividendYield === 'positive') {
    QdividendYield = {
      $gt: 0
    }
  } else if (body.dividendYield === '1') {
    QdividendYield = {
      $gte: 1,
      $lte: 3
    }
  } else if (body.dividendYield === '3') {
    QdividendYield = {
      $gte: 3,
      $lte: 5
    }
  } else if (body.dividendYield === '5') {
    QdividendYield = {
      $gte: 5,
      $lte: 7
    }
  } else if (body.dividendYield === '7') {
    QdividendYield = {
      $gte: 7,
      $lte: 9
    }
  } else if (body.dividendYield === '9') {
    QdividendYield = {
      $gte: 9
    }
  }

  var QEPSSurprisePercent = { $exists: true }
  if (body.EPSSurprisePercent === '1') {
    QEPSSurprisePercent = {
      $gte: 1,
      $lte: 3
    }
  } else if (body.EPSSurprisePercent === '3') {
    QEPSSurprisePercent = {
      $gte: 3,
      $lte: 5
    }
  } else if (body.EPSSurprisePercent === '5') {
    QEPSSurprisePercent = {
      $gte: 5
    }
  }

  var Qbeta = { $exists: true }
  if (body.beta === 'negative') {
    Qbeta = {
      $lt: 0
    }
  } else if (body.beta === '0-0.5') {
    Qbeta = {
      $gte: 0,
      $lte: 0.5
    }
  } else if (body.beta === '0.5-1') {
    Qbeta = {
      $gte: 0.5,
      $lte: 1
    }
  } else if (body.beta === '1-1.5') {
    Qbeta = {
      $gte: 1,
      $lte: 1.5
    }
  } else if (body.beta === '1.5-2') {
    Qbeta = {
      $gte: 1.5,
      $lte: 2
    }
  } else if (body.beta === '2-3') {
    Qbeta = {
      $gte: 2,
      $lte: 3
    }
  } else if (body.beta === '3-5') {
    Qbeta = {
      $gte: 3,
      $lte: 5
    }
  } else if (body.beta === '5') {
    Qbeta = {
      $gte: 5
    }
  }

  var QpeRatio = { $exists: true }
  if (body.peRatio === 'profitable'){
    QpeRatio = {
      $gt: 0
    }
  } else if (body.peRatio === 'low'){
    QpeRatio = {
      $lte: 15
    }
  } else if (body.peRatio === 'high'){
    QpeRatio = {
      $gte: 50
    }
  } else if (body.peRatio === '<5'){
    QpeRatio = {
      $lte: 5
    }
  } else if (body.peRatio === '<10'){
    QpeRatio = {
      $lte: 10
    }
  } else if (body.peRatio === '<20'){
    QpeRatio = {
      $lte: 20
    }
  } else if (body.peRatio === '<30'){
    QpeRatio = {
      $lte: 30
    }
  } else if (body.peRatio === '>5'){
    QpeRatio = {
      $gte: 5
    }
  } else if (body.peRatio === '>10'){
    QpeRatio = {
      $gte: 10
    }
  } else if (body.peRatio === '>20'){
    QpeRatio = {
      $gte: 20
    }
  } else if (body.peRatio === '>30'){
    QpeRatio = {
      $gte: 30
    }
  } 
 
  var Qday50SMAAbovePrice = { $exists: true }
  if (body.day50MovingAvg.indexOf('belowPrice') !== -1){
    Qday50SMAAbovePrice = {
      $eq: false
    }
  } else if (body.day50MovingAvg.indexOf('abovePrice') !== -1){
    Qday50SMAAbovePrice = {
      $eq: true
    }
  }

  var Qday50SMAAboveDay200SMA = { $exists: true }
  if (body.day50MovingAvg.indexOf('belowSMA200') !== -1) {
    Qday50SMAAboveDay200SMA = {
      $eq: false
    }
  } else if (body.day50MovingAvg.indexOf('aboveSMA200') !== -1) {
    Qday50SMAAboveDay200SMA = {
      $eq: true
    }
  }

  var Qday50SMAtoPrice = { $exists: true }
  if (body.day50MovingAvg === '1%belowPrice') {
    Qday50SMAtoPrice = {
      $gte:-0.01,
      $lte:0
    }
  } else if (body.day50MovingAvg === '5%belowPrice') {
    Qday50SMAtoPrice = {
      $gte:-0.05,
      $lte:-0.01
    }
  } else if (body.day50MovingAvg === '10%belowPrice') {
    Qday50SMAtoPrice = {
      $lte:-0.10
    }
  } else if (body.day50MovingAvg === '1%abovePrice') {
    Qday50SMAtoPrice = {
      $gte:0.01,
      $lte:0.05
    }
  } else if (body.day50MovingAvg === '5%abovePrice') {
    Qday50SMAtoPrice = {
      $gte:0.05,
      $lte:0.1
    }
  } else if (body.day50MovingAvg === '10%abovePrice') {
    Qday50SMAtoPrice = {
      $gte:0.10
    }
  }

  var Qday50SMAtoDay200SMA = { $exists: true }
  if (body.day50MovingAvg === '1%belowSMA200') {
    Qday50SMAtoDay200SMA = {
      $gte:-0.01,
      $lte:0
    }
  } else if (body.day50MovingAvg === '5%belowSMA200') {
    Qday50SMAtoDay200SMA = {
      $gte:-0.05,
      $lte:-0.01
    }
  } else if (body.day50MovingAvg === '10%belowSMA200') {
    Qday50SMAtoDay200SMA = {
      $lte:-0.10
    }
  } else if (body.day50MovingAvg === '1%aboveSMA200') {
    Qday50SMAtoDay200SMA = {
      $gte:0.01,
      $lte:0.05
    }
  } else if (body.day50MovingAvg === '5%aboveSMA200') {
    Qday50SMAtoDay200SMA = {
      $gte:0.05,
      $lte:0.1
    }
  } else if (body.day50MovingAvg === '10%aboveSMA200') {
    Qday50SMAtoDay200SMA = {
      $gte:0.10
    }
  }

  var Qday200SMAAbovePrice = { $exists: true }
  if (body.day200MovingAvg.indexOf('belowPrice') !== -1){
    Qday200SMAAbovePrice = {
      $eq: false
    }
  } else if (body.day200MovingAvg.indexOf('abovePrice') !== -1){
    Qday200SMAAbovePrice = {
      $eq: true
    }
  }

  var Qday200SMAtoPrice = { $exists: true }
  if (body.day200MovingAvg === '1%belowPrice') {
    Qday200SMAtoPrice = {
      $gte:-0.01,
      $lte:0
    }
  } else if (body.day200MovingAvg === '5%belowPrice') {
    Qday200SMAtoPrice = {
      $gte:-0.05,
      $lte:-0.01
    }
  } else if (body.day200MovingAvg === '10%belowPrice') {
    Qday200SMAtoPrice = {
      $lte:-0.10
    }
  } else if (body.day200MovingAvg === '1%abovePrice') {
    Qday200SMAtoPrice = {
      $gte:0.01,
      $lte:0.05
    }
  } else if (body.day200MovingAvg === '5%abovePrice') {
    Qday200SMAtoPrice = {
      $gte:0.05,
      $lte:0.1
    }
  } else if (body.day200MovingAvg === '10%abovePrice') {
    Qday200SMAtoPrice = {
      $gte:0.10
    }
  }

  var Qday200SMAtoDay50SMA = { $exists: true }
  if (body.day50MovingAvg === '1%belowSMA50') {
    Qday200SMAtoDay50SMA = {
      $gte:-0.01,
      $lte:0
    }
  } else if (body.day50MovingAvg === '5%belowSMA50') {
    Qday200SMAtoDay50SMA = {
      $gte:-0.05,
      $lte:-0.01
    }
  } else if (body.day50MovingAvg === '10%belowSMA50') {
    Qday200SMAtoDay50SMA = {
      $lte:-0.10
    }
  } else if (body.day50MovingAvg === '1%aboveSMA50') {
    Qday200SMAtoDay50SMA = {
      $gte:0.01,
      $lte:0.05
    }
  } else if (body.day50MovingAvg === '5%aboveSMA50') {
    Qday200SMAtoDay50SMA = {
      $gte:0.05,
      $lte:0.1
    }
  } else if (body.day50MovingAvg === '10%aboveSMA50') {
    Qday200SMAtoDay50SMA = {
      $gte:0.10
    }
  }

  Screener.find({
    marketcap: QmarketCap,
    dividendYield: QdividendYield,
    EPSSurprisePercent: QEPSSurprisePercent,
    beta: Qbeta,
    peRatio: QpeRatio,
    day50SMAAboveDay200SMA: Qday50SMAAboveDay200SMA,
    day50SMAAbovePrice: Qday50SMAAbovePrice,
    day50SMAtoPrice: Qday50SMAtoPrice,
    day50SMAtoDay200SMA: Qday50SMAtoDay200SMA,
    day200SMAAbovePrice: Qday200SMAAbovePrice,
    day200SMAtoPrice: Qday200SMAtoPrice,
    day200SMAtoDay50SMA: Qday200SMAtoDay50SMA
  }).then((filteredData) => {
    res.status(200).send(filteredData);
  }).catch(e => {
    console.log(e);
  });
  // res.status(200).send(res);
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
  User.findOne({ email: body.email }).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.send(body.email);
  }).catch((e) => {
    res.status(400).send();
  });
});

//Update Screener Collection everyday at midnight
schedule.scheduleJob('0 0 * * *', () => {
  Screener.collection.drop();
  var symbolArr = [];
  var symbolChunk = '';
  try {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols').then(result => {
      var screenerDataArr = result.data;
      var chunk = 100;
      var j = 0;
      for (var i = 0; i < screenerDataArr.length; i = i + chunk) {
        symbolArr[j] = screenerDataArr.slice(i, i + chunk); //Slice into chunks of 100 
        j++;
      }
      console.log(screenerDataArr.length);
      return symbolArr;
    }).then(arr => {
      for (var i = 0; i < arr.length; i++) {
        symbolChunk = '';
        arr[i].forEach(element => {
          symbolChunk = symbolChunk + element.symbol + ','
        });
        axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbolChunk + '&types=quote,stats').then(stat => {
          for (key in stat.data) {
            if (stat.data.hasOwnProperty(key)) {
              var statsAndQuote= Object.assign({}, stat.data[key].stats, stat.data[key].quote);
              var statData = new Screener(statsAndQuote);
              statData.save().then(() => {
              }).catch(e => {
                if (e.errors.symbol.message !== "Path `symbol` is required."){
                  console.log(e);
                }
              });
            }
          }
        }).catch(e => {
          //console.log(e);
        });
      };
      console.log('Screener Data Saved');
    }).catch(e => {
      //console.log(e);
    });
  } catch (e) {
    // res.status(400).send();
  }
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log('Express listening on port ' + PORT + '!');
});
