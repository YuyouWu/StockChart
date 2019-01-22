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
  smaWindow: {
    type: Number,
    required: true,
    default: 20
  },
  emaWindow: {
    type: Number,
    required: true,
    default: 20
  },
  wmaWindow: {
    type: Number,
    required: true,
    default: 20
  },
  tmaWindow: {
    type: Number,
    required: true,
    default: 20
  },
  _creator: {
  	type: mongoose.Schema.Types.ObjectId,
  	required: true
  }
});

module.exports = {ChartPref};
