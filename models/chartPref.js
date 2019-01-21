var mongoose = require('mongoose');

var ChartPref = mongoose.model('ChartPref', {
  showMACD: {
    type: Boolean,
    required: true,
    default: false
  },
  showRSI: {
    type: Boolean,
    required: true,
    default: false
  },
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  }
});

module.exports = {ChartPref};
