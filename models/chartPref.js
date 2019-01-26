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
  showSMA: {
    type: Boolean,
    required: true,
    default: false
  },
  showEMA: {
    type: Boolean,
    required: true,
    default: false
  },
  showWMA: {
    type: Boolean,
    required: true,
    default: false
  },
  showTMA: {
    type: Boolean,
    required: true,
    default: false
  },
  showCandle:{
    type: Boolean,
    required: true,
    default: true
  },
  showLine:{
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
