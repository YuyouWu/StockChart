import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import { Row, Col, Divider as AntDivider, Button } from 'antd';
import { Divider, Spinner, NonIdealState } from '@blueprintjs/core';
import axios from 'axios';
import Chart from './Chart';
import currentWeekNumber from 'current-week-number';

const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/last');
// socket.on('connect', () => {
// 	socket.emit('subscribe', 'AAPL');
// });

//Class for rendering each individual tickers on portfolio
class Summary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			priceData: '',
			statData: '',
			chartData: '',
			changePercent: 0,
			notFound: false,
			textColor: 'green',
			afterHourColor: 'green',
			currentTickerId: this.props.tickerId,
			currentTicker: this.props.ticker,
			forceUpdate: '',
			timeframe: 'day'
		}
		this.loadData = this.loadData.bind(this);

		socket.on('message', (message) => {
			//Update price data 
			if (this.state.priceData) {
				var priceDataObj = this.state.priceData;
				priceDataObj.price = JSON.parse(message).price;
				this.setState({
					priceData: priceDataObj,
					changePercent: ((priceDataObj.price - priceDataObj.previousClose) / priceDataObj.previousClose) * 100
				});
			}

			//Update Chart data
			if (this.state.chartData && priceDataObj) {
				var chartDataObj = this.state.chartData;
				var chartDate = this.state.chartData[this.state.chartData.length - 1].date;
				var priceDate = new Date(this.state.priceData.latestUpdate);
				//Check if date of price is the same the last element of chart
				if (chartDate.toDateString() === priceDate.toDateString()) {
					chartDataObj = this.state.chartData;
					//update last element of chartData
					chartDataObj[chartDataObj.length - 1] = {
						date: new Date(this.state.priceData.latestUpdate),
						open: this.state.priceData.open,
						high: this.state.priceData.high,
						low: this.state.priceData.low,
						close: priceDataObj.price,
						volume: this.state.priceData.latestVolume
					};
					this.setState({
						chartData: chartDataObj,
						forceUpdate: priceDataObj.price
					});
				}
			}
		});
	}

	componentDidMount() {
		this.setState({
			//chartData: '',
			notFound: false
		});
		this.loadData(this.props.ticker);
	}

	componentWillReceiveProps(newProps) {
		socket.emit('unsubscribe', this.props.ticker.toString());
		this.setState({
			//chartData: '',
			priceData: '',
			notFound: false,
			currentTickerId: newProps.tickerId,
			currentTicker: newProps.ticker
		});
		this.loadData(newProps.ticker);
	}

	componentWillUnmount() {
		socket.emit('unsubscribe', this.state.currentTicker.toString());
	}

	setTimeframeDay = () => {
		this.setState({
			timeframe: 'day'
		},() => {
			this.loadData(this.state.currentTicker);
		});
	}

	setTimeframeWeek = () => {
		this.setState({
			timeframe: 'week'
		},() => {
			this.loadData(this.state.currentTicker);
		});
	}

	setTimeframeMonth = () => {
		this.setState({
			timeframe: 'month'
		},() => {
			this.loadData(this.state.currentTicker);
		});
	}


	loadData(ticker) {
		// socket.emit('unsubscribe', this.props.ticker.toString());
		socket.emit('subscribe', ticker.toString());

		//Get current price for ticker 
		this.props.getCurrentPrice(ticker).then((res) => {
			this.setState({
				priceData: res.payload,
				latestPrice: res.payload.latestPrice,
				changePercent: res.payload.changePercent * 100
			});

			if (this.state.priceData.change > 0) {
				this.setState({
					textColor: 'green'
				});
			} else {
				this.setState({
					textColor: 'red'
				});
			}

			if (this.state.priceData.extendedChangePercent > 0) {
				this.setState({
					afterHourColor: 'green'
				});
			} else {
				this.setState({
					afterHourColor: 'red'
				});
			}

		}).catch(error => {
			this.setState({
				priceData: null,
				notFound: true
			});
		});

		//Get company stat 
		this.props.getCompanyStat(ticker).then((res) => {
			this.setState({
				statData: res.payload
			});
		}).catch(error => {
			this.setState({
				statData: null,
				notFound: true
			});
		});

		//get chart data
		axios.get('https://api.iextrading.com/1.0/stock/' + ticker + '/chart/5y').then((res) => {
			if (res.data) {
				res.data.forEach((obj) => {
					obj.date = new Date(obj.date + 'T21:00:00.000Z');
				});
				this.setState({
					chartData: res.data
				}, () => {
					//Setting timeframe
					if(this.state.timeframe == 'week'){
						var weekDataArr = [];
						var tempData = {};
						for (var i = 0; i < this.state.chartData.length; i++){
							if (i == 0){
								tempData.date = this.state.chartData[i].date;
								tempData.open = this.state.chartData[i].open;
								tempData.high = this.state.chartData[i].high;
								tempData.low = this.state.chartData[i].low;
								tempData.volume = parseInt(this.state.chartData[i].volume);
							} else if (currentWeekNumber(this.state.chartData[i].date)!==currentWeekNumber(this.state.chartData[i-1].date)){
								weekDataArr.push(tempData);
								tempData = {volume: 0};
								tempData.date = this.state.chartData[i].date;
								tempData.open = this.state.chartData[i].open;
								tempData.high = this.state.chartData[i].high;
								tempData.low = this.state.chartData[i].low;
								tempData.volume = parseInt(this.state.chartData[i].volume) + parseInt(tempData.volume);
							} else {
								tempData.close = this.state.chartData[i].close;
								tempData.volume = parseInt(this.state.chartData[i].volume) + parseInt(tempData.volume);
								if(tempData.high < this.state.chartData[i].high){
									tempData.high = this.state.chartData[i].high;
								}
								if(tempData.low > this.state.chartData[i].low){
									tempData.low = this.state.chartData[i].low;
								}
								if(i === this.state.chartData.length - 1){
									weekDataArr.push(tempData);
								}
							}
						}
						this.setState({
							chartData: weekDataArr
						});
					} else if (this.state.timeframe == 'month') {
						var monthDataArr = [];
						var tempData = {};
						for (var i = 0; i < this.state.chartData.length; i++){
							if (i == 0){
								tempData.date = this.state.chartData[i].date;
								tempData.open = this.state.chartData[i].open;
								tempData.high = this.state.chartData[i].high;
								tempData.low = this.state.chartData[i].low;
								tempData.volume = parseInt(this.state.chartData[i].volume);
							} else if (this.state.chartData[i].date.getMonth() !== this.state.chartData[i-1].date.getMonth()){
								monthDataArr.push(tempData);
								tempData = {volume: 0};
								tempData.date = this.state.chartData[i].date;
								tempData.open = this.state.chartData[i].open;
								tempData.high = this.state.chartData[i].high;
								tempData.low = this.state.chartData[i].low;
								tempData.volume = parseInt(this.state.chartData[i].volume) + parseInt(tempData.volume);
							} else {
								tempData.close = this.state.chartData[i].close;
								tempData.volume = parseInt(this.state.chartData[i].volume) + parseInt(tempData.volume);
								if(tempData.high < this.state.chartData[i].high){
									tempData.high = this.state.chartData[i].high;
								}
								if(tempData.low > this.state.chartData[i].low){
									tempData.low = this.state.chartData[i].low;
								}
								if(i === this.state.chartData.length - 1){
									monthDataArr.push(tempData);
								}
							}
						}
						this.setState({
							chartData: monthDataArr
						});
					} else if (this.state.timeframe == 'day') {
						var chartDate = this.state.chartData[this.state.chartData.length - 1].date;
						var priceDate = new Date(this.state.priceData.latestUpdate);
						//Push current priceData to chartData if priceData is one day ahead
						if (chartDate.toDateString() !== priceDate.toDateString()) {
							var chartDataObj = this.state.chartData;
							chartDataObj.push({
								date: new Date(this.state.priceData.latestUpdate),
								open: this.state.priceData.open,
								high: this.state.priceData.high,
								low: this.state.priceData.low,
								close: this.state.priceData.latestPrice,
								volume: this.state.priceData.latestVolume
							});
							this.setState({
								chartData: chartDataObj
							});
						}	
					}
				});
			}
		})
	}


	render() {
		return (
			<div>
				<Divider style={{ marginTop: '-21px' }} />
				{this.state.priceData && this.state.chartData && this.state.statData ? (
					<div>
						<Row>
							<Col>
								<h4>{this.props.ticker} - {this.state.statData.companyName}</h4>
							</Col>
						</Row>
						<Row>
							{
								this.state.priceData.extendedPriceTime === this.state.priceData.latestUpdate && this.state.priceData.price ? (
									<div>
										<Col span={2}>
											<p style={{ color: this.state.textColor }}>${this.state.priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
										</Col>
										<Col span={2}>
											<p style={{ color: this.state.textColor }}>{(this.state.priceData.price - this.state.priceData.previousClose).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
										</Col>
									</div>
								) : (
										<div>
											<Col span={2}>
												<p style={{ color: this.state.textColor }}>${this.state.priceData.latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
											</Col>
											<Col span={2}>
												<p style={{ color: this.state.textColor }}>{this.state.priceData.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
											</Col>
										</div>
									)
							}
							<Col span={2}>
								<p style={{ color: this.state.textColor }}>{this.state.changePercent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
							</Col>
							<Col span={2}>
								<p>{this.props.quantity} shares</p>
							</Col>
							{this.state.priceData.extendedPriceTime !== this.state.priceData.latestUpdate &&
								<div>
									<Col span={1}>
										<AntDivider type="vertical" />
									</Col>
									<Col span={2}>
										<p>After Hour:</p>
									</Col>
									<Col span={2}>
										<p style={{ color: this.state.afterHourColor }}>${this.state.priceData.extendedPrice}</p>
									</Col>
									<Col span={2}>
										<p style={{ color: this.state.afterHourColor }}>{(this.state.priceData.extendedChangePercent * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
									</Col>
								</div>
							}
						</Row>
						<Row gutter={24} style={{ marginTop: '5px' }}>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>Open {this.state.priceData.open}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>High {this.state.priceData.high}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>Low {this.state.priceData.low}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>PE Ratio {this.state.priceData.peRatio}</p>
							</Col>
							<Col span={6}>
								<p style={{ fontSize: '12px' }}>Market Cap {this.state.priceData.marketCap.toLocaleString(undefined)}</p>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>52 wk High {this.state.priceData.week52High}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>52 wk Low {this.state.priceData.week52Low}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>EPS {this.state.statData.ttmEPS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>Dividend Rate {this.state.statData.dividendRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
							</Col>
							<Col span={4}>
								<p style={{ fontSize: '12px' }}>Dividend Yield {this.state.statData.dividendYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
							</Col>
						</Row>
						<div style={{ marginTop: '5px' }}>
							<Chart
								type="hybrid"
								data={this.state.chartData}
								tickerId={this.state.currentTickerId}
								forceUpdate = {this.state.forceUpdate}
								setTimeframeDay = {this.setTimeframeDay}
								setTimeframeWeek = {this.setTimeframeWeek}
								setTimeframeMonth = {this.setTimeframeMonth}
							/>
						</div>
						<p style={{ fontSize: '12px' }}>Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.</p>
					</div>
				) : (
						<div>
							{this.state.notFound ? (
								<div style={{ marginTop: '50px' }}>
									<NonIdealState
										title="Ticker Symbol Not Found"
										description="Please make sure you have the correct ticker."
									/>
								</div>
							) : (
									<div style={{ marginTop: '50px' }}>
										<Spinner size={100} value={null} />
									</div>

								)
							}
						</div>
					)
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps, { getCurrentPrice, getCompanyStat })(Summary);
