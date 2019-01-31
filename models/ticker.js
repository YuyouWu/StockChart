var mongoose = require('mongoose');

var Ticker = mongoose.model('Ticker', {
  ticker: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  quantity: {
    type: Number,
    required: false
  },
  buyPrice: {
    type: Number,
    required: false
  },
  sellPrice: {
    type: Number,
    required: false
  },
  avgCost: {
    type: Number,
    required: false
  },
  index:{
    type: Number,
    required: true
  },
  portfolioId:{
    type: String,
    required: true,
    default: 'WatchList'
  },
  trend: {
    type: Array,
    required: false
  },
  channel: {
    type: Array,
    required: false
  },
  stdchannel: {
    type: Array,
    required: false
  },
  retracement: {
    type: Array,
    required: false
  },
  fan: {
    type: Array,
    required: false
  },
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  }
});

module.exports = {Ticker};
