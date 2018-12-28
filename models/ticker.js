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
  index:{
    type: Number,
    required: true
  },
  portfolioName:{
    type: String,
    required: true,
    default: 'Watch List'
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
