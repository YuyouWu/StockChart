var mongoose = require('mongoose');

var Transaction = mongoose.model('Transaction', {
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  },
  ticker: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date, 
    required: true
  },
  action: {
    type: String,
    required: true
  },
  price : {
    type: Number,
    required: true
  }
});

module.exports = {Transaction};
