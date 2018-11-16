var mongoose = require('mongoose');

var Portfolio = mongoose.model('Portfolio', {
  portfolioName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  }
});

module.exports = {Portfolio};
