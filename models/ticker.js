var mongoose = require('mongoose');

var Ticker = mongoose.model('Ticker', {
  ticker: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
});

module.exports = {Ticker};
