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
    primaryExchange: {
        type: String
    },
    sector: {
        type: String
    },
    latestPrice: {
        type: Number
    },
    changePercent: {
        type: Number
    },
    peRatio: {
        tyoe: Number
    },
    marketcap: {
        type: Number,
        required: false
    },
    beta: {
        type: Number,
        required: false
    },
    week52high: {
        type: Number,
        required: false
    },
    week52low: {
        type: Number,
        required: false
    },
    week52change: {
        type: Number,
        required: false
    },
    dividendRate: {
        type: Number,
        required: false
    },
    dividendYield: {
        type: Number,
        required: false
    },
    consensusEPS: {
        type: Number,
        required: false
    },
    // EPSSurpriseDollar: {
    //     type: String,
    //     required: false
    // },
    EPSSurprisePercent: {
        type: String,
        required: false
    },
    revenue: {
        type: String,
        required: false
    },
    grossProfit: {
        type: String,
        required: false
    },
    cash: {
        type: String,
        required: false
    },
    debt: {
        type: String,
        required: false
    },
    ttmEPS: {
        type: String,
        required: false
    },
    // revenuePerShare: {
    //     type: String,
    //     required: false
    // },
    // revenuePerEmployee: {
    //     type: String,
    //     required: false
    // },
    // peRatioHigh: {
    //     type: String,
    //     required: false
    // },
    // peRatioLow: {
    //     type: String,
    //     required: false
    // },
    // returnOnAssets: {
    //     type: String,
    //     required: false
    // },
    // returnOnCapital: {
    //     type: String,
    //     required: false
    // },
    // profitMargin: {
    //     type: String,
    //     required: false
    // },
    // priceToSales: {
    //     type: String,
    //     required: false
    // },
    // priceToSales: {
    //     type: String,
    //     required: false
    // },
    // priceToBook: {
    //     type: String,
    //     required: false
    // },
    // day200MovingAvg: {
    //     type: String,
    //     required: false
    // },
    // day50MovingAvg: {
    //     type: String,
    //     required: false
    // },
    // institutionPercent: {
    //     type: String,
    //     required: false
    // },
    // insiderPercent: {
    //     type: String,
    //     required: false
    // },
    // shortRatio: {
    //     type: String,
    //     required: false
    // },
    year5ChangePercent: {
        type: Number,
        required: false
    },
    year2ChangePercent: {
        type: Number,
        required: false
    },
    year1ChangePercent: {
        type: Number,
        required: false
    },
    ytdChangePercent: {
        type: Number,
        required: false
    },
    month6ChangePercent: {
        type: Number,
        required: false
    },
    month3ChangePercent: {
        type: Number,
        required: false
    },
    month1ChangePercent: {
        type: Number,
        required: false
    },
    day5ChangePercent: {
        type: Number,
        required: false
    },
    day30ChangePercent: {
        type: Number,
        required: false
    }
});

module.exports = {Screener};
