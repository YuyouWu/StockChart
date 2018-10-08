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
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  }
});

module.exports = {Ticker};
