import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import { Row, Col, Divider as AntDivider, Button } from 'antd';
import { Divider, Spinner, NonIdealState } from '@blueprintjs/core';
import axios from 'axios';
import Chart from './Chart';

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
			forceUpdate: ''
		}
		this.loadData = this.loadData.bind(this);

		socket.on('message', (message) => {
			console.log(message);
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
			if (this.state.chartData) {
				var chartDataObj = this.state.chartData;
				var chartDate = this.state.chartData[this.state.chartData.length - 1].date;
				var priceDate = new Date(this.state.priceData.latestUpdate);
				//Check if date of price is the same the last element of chart
				if (chartDate.toDateString() === priceDate.toDateString()) {
					var chartDataObj = this.state.chartData;
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
											<p style={{ color: this.state.textColor }}>${this.state.priceData.price}</p>
										</Col>
										<Col span={2}>
											<p style={{ color: this.state.textColor }}>{(this.state.priceData.price - this.state.priceData.previousClose).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
										</Col>
									</div>
								) : (
										<div>
											<Col span={2}>
												<p style={{ color: this.state.textColor }}>${this.state.priceData.latestPrice}</p>
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
							/>
						</div>
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
