var mongoose = require('mongoose');

var Screener = mongoose.model('Screener', {
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String
    },
    marketcap: {
        type: Number,
        required: false
    }
});

module.exports = {Screener};
