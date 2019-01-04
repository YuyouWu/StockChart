import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import { Row, Col } from 'antd';
import { Divider, Spinner, NonIdealState } from '@blueprintjs/core';
import axios from 'axios';
import Chart from './Chart';

//Class for rendering each individual tickers on portfolio
class Summary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			priceData: '',
			statData: '',
			chartData: '',
			notFound: false,
			textColor: 'green',
			currentTickerId: this.props.tickerId
		}
		this.loadData = this.loadData.bind(this);
	}

	componentDidMount() {
		this.setState({
			chartData: '',
			notFound: false
		});
		this.loadData(this.props.ticker);
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			chartData: '',
			notFound: false,
			currentTickerId: newProps.tickerId
		});
		this.loadData(newProps.ticker);
	}

	loadData(ticker) {
		//Get current price for ticker 
		this.props.getCurrentPrice(ticker).then((res) => {
			this.setState({
				priceData: res.payload,
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
					obj.date = new Date(obj.date);
				});
				this.setState({
					chartData: res.data
				});
			}
		});

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
							<Col span={2}>
								<p style={{ color: this.state.textColor }}>${this.state.priceData.delayedPrice}</p>
							</Col>
							<Col span={2}>
								<p style={{ color: this.state.textColor }}>{this.state.priceData.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
							</Col>
							<Col span={2}>
								<p style={{ color: this.state.textColor }}>{this.state.changePercent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
							</Col>
							<Col span={2}>
								<p>{this.props.quantity} shares</p>
							</Col>
						</Row>
						<Row gutter={24} style={{marginTop:'5px'}}>
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
						<div style={{marginTop:'5px'}}>
							<Chart 
								type="hybrid" 
								data={this.state.chartData} 
								tickerId={this.state.currentTickerId}
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
