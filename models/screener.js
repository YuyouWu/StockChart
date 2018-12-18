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
        type: String,
        required: false
    },
    beta: {
        type: String,
        required: false
    },
    week52high: {
        type: String,
        required: false
    },
    week52low: {
        type: String,
        required: false
    },
    week52change: {
        type: String,
        required: false
    },
    dividendRate: {
        type: String,
        required: false
    },
    dividendYield: {
        type: String,
        required: false
    },
    exDividendDate: {
        type: String,
        required: false
    },
    returnOnEquity: {
        type: String,
        required: false
    },
    consensusEPS: {
        type: String,
        required: false
    },
    EPSSurpriseDollar: {
        type: String,
        required: false
    },
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
    revenuePerShare: {
        type: String,
        required: false
    },
    revenuePerEmployee: {
        type: String,
        required: false
    },
    peRatioHigh: {
        type: String,
        required: false
    },
    peRatioLow: {
        type: String,
        required: false
    },
    returnOnAssets: {
        type: String,
        required: false
    },
    returnOnCapital: {
        type: String,
        required: false
    },
    profitMargin: {
        type: String,
        required: false
    },
    priceToSales: {
        type: String,
        required: false
    },
    priceToSales: {
        type: String,
        required: false
    },
    priceToBook: {
        type: String,
        required: false
    },
    day200MovingAvg: {
        type: String,
        required: false
    },
    day50MovingAvg: {
        type: String,
        required: false
    },
    institutionPercent: {
        type: String,
        required: false
    },
    insiderPercent: {
        type: String,
        required: false
    },
    shortRatio: {
        type: String,
        required: false
    },
    year5ChangePercent: {
        type: String,
        required: false
    },
    year2ChangePercent: {
        type: String,
        required: false
    },
    year1ChangePercent: {
        type: String,
        required: false
    },
    ytdChangePercent: {
        type: String,
        required: false
    },
    month6ChangePercent: {
        type: String,
        required: false
    },
    month3ChangePercent: {
        type: String,
        required: false
    },
    month1ChangePercent: {
        type: String,
        required: false
    },
    day5ChangePercent: {
        type: String,
        required: false
    },
    day30ChangePercent: {
        type: String,
        required: false
    }
});

module.exports = {Screener};
