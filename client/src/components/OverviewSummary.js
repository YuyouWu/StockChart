import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Row, Col, Table } from 'antd';
import { Card, Elevation, Divider, HTMLTable } from "@blueprintjs/core";
import axios from 'axios';

var tickerList = [];
var totalQuantity = 0;
var totalChange = 0;
var totalValue = 0;
//Class for rendering each individual tickers on portfolio
class OverviewSummary extends React.Component {
	constructor() {
		super();
		this.state = {
			tickerList: [],
			totalQuantity: 0,
			avgPercChange: 0,
			totalValue: 0,
			totalChange: 0,
			textColor: 'green',
			topGainers: [''],
			topLosers: [''],
			sectorData: [''],
			loading: true,
			forceUpdate: ''
		}
	}

	componentDidMount() {
		tickerList = [];
		totalQuantity = 0;
		totalChange = 0;
		totalValue = 0;

		//Get tickers and total quantity of shares owned
		this.props.getTickers().then((res) => {
			var tickers = res.payload;

			//Calculate Total Quantity first
			tickers.forEach((element) => {
				totalQuantity = totalQuantity + element.quantity;
			});

			tickers.forEach((element, index) => {
				if (element.quantity > 0) {
					this.props.getCurrentPrice(element.ticker).then((res) => {
						element.latestPrice = res.payload.latestPrice;
						element.change = res.payload.change;
						element.changePercent = res.payload.changePercent;
						element.value = res.payload.latestPrice * element.quantity;

						tickerList.push(element);

						totalValue = totalValue + element.value;
						totalChange = totalChange + (res.payload.change * element.quantity)

						this.setState({
							forceUpdate: element,
							tickerList: tickerList,
							totalQuantity: totalQuantity,
							totalValue: totalValue,
							totalChange: totalChange
						});
					});
				}
			});
		});

		//Get top gainers and top losers
		axios.get('https://api.iextrading.com/1.0/stock/market/list/gainers').then(res => {
			this.setState({
				topGainers: res.data
			});
		});
		axios.get('https://api.iextrading.com/1.0/stock/market/list/losers').then(res => {
			this.setState({
				topLosers: res.data
			});
		});

		//Get market sector performance
		axios.get('https://api.iextrading.com/1.0/stock/market/sector-performance').then(res => {
			this.setState({
				sectorData: res.data
			});
		});
	}


	render() {
		const columns = [{
			title: 'Symbol',
			dataIndex: 'symbol',
			key: 'symbol',
			render: (text) => {
				return (
					<Button
						color="link"
						onClick={() => this.props.setCurrentTicker(text)}
					>
						{text}
					</Button>
				)
			}
		}, {
			title: 'Change',
			dataIndex: 'changePercent',
			key: 'changePercent',
			render: (text) => {
				return (
					text > 0 ? (
						<p style={{ color: 'green' }}>{(text * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
					) : (
							<p style={{ color: 'red' }}>{(text * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
						)
				)
			}
		}];

		return (
			<div>
				<Divider style={{ marginTop: '-21px' }} />
				<h3>Portfolio Performance</h3>
				<HTMLTable
					interactive={true}
					striped={true}
				>
					<thead>
						<tr>
							<th style={{width:'80px'}}>Symbol</th>
							<th style={{width:'100px', textAlign:'right'}}>Price</th>
							<th style={{width:'110px', textAlign:'right'}}>Day Change</th>
							<th style={{width:'120px', textAlign:'right'}}>Day Change %</th>
							<th style={{width:'100px', textAlign:'center'}}>Shares</th>
							<th style={{width:'100px'}}>Weight</th>
							<th style={{width:'120px', textAlign:'right'}}>Market Value</th>
						</tr>
					</thead>
					<tbody>
						{this.state.tickerList.map((element) => {
							return (
								<tr>
									<td>{element.ticker}</td>
									<td style={{textAlign:'right'}}>{element.latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									{
										element.change > 0 ? (
											<td style={{color: 'green', textAlign:'right'}}>{element.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										):(
											<td style={{color: 'red', textAlign:'right'}}>{element.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										)
									}

									{
										element.changePercent > 0 ? (
											<td style={{color: 'green', textAlign:'right'}}>{(element.changePercent * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
										):(
											<td style={{color: 'red', textAlign:'right'}}>{(element.changePercent * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
										)
									}
									<td style={{textAlign:'center'}}>{element.quantity}</td>
									<td>{(element.value/this.state.totalValue*100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
									<td style={{textAlign:'right'}}>{element.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
								</tr>
							)
						})}
						<tr>
							<td style={{fontWeight:'bold'}}>Total</td>
							<td></td>
							{
								this.state.totalChange > 0 ? (
									<td 
										style={{
											color: 'green', 
											textAlign:'right', 
											fontWeight:'bold'
										}}
									>
										{(this.state.totalChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>
								):(
									<td 
										style={{
											color: 'red', 
											textAlign:'right', 
											fontWeight:'bold'
										}}
									>
										{(this.state.totalChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>	
								)
							}
							{
								this.state.totalChange > 0 ? (
									<td 
										style={{
											color: 'green', 
											textAlign:'right', 
											fontWeight:'bold'
										}}>
											{(this.state.totalChange/(this.state.totalValue - this.state.totalChange)*100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
									</td>
									):(
									<td 
										style={{
											color: 'red', 
											textAlign:'right', 
											fontWeight:'bold'
										}}>
											{(this.state.totalChange/(this.state.totalValue - this.state.totalChange)*100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
									</td>
									)
							}
							<td></td>
							<td></td>
							<td style={{textAlign:'right', fontWeight:'bold'}}>{this.state.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
						</tr>
					</tbody>
				</HTMLTable>


				<h3 style={{ marginTop: '40px' }}>Market Sector Performance</h3>
				<Row>
					<div style={{ width: '850px' }}>
						{this.state.sectorData ? (
							this.state.sectorData.map((sector) => {
								return (
									<Col span={4}>
										<Card
											elevation={Elevation.ONE}
											style={{ width: 130, height: 120, marginTop: '15px' }}
										>
											<p>{sector.name}</p>
											{sector.performance < 0 ? (
												<p style={{ color: 'red' }}>{(sector.performance * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
											) : (
													<p style={{ color: 'green' }}>{(sector.performance * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
												)}
										</Card>
									</Col>
								)
							})
						) : (
								<p>Loading</p>
							)}
					</div>
				</Row>

				<Row style={{ marginTop: '20px' }}>
					<Col span={3} style={{ marginRight: '50px', width: '150px' }}>
						<h3 style={{ marginTop: '20px' }}>Top Gainers</h3>
						<Table
							dataSource={this.state.topGainers}
							columns={columns}
							showHeader={false}
							pagination={false}
							size="middle"
						/>
					</Col>
					<Col span={3} style={{ width: '150px' }}>
						<h3 style={{ marginTop: '20px' }}>Top Losers</h3>
						<Table
							dataSource={this.state.topLosers}
							columns={columns}
							showHeader={false}
							pagination={false}
							size="middle"
						/>
					</Col>
				</Row>
				<Divider style={{ marginTop: '20px' }} />
				<p style={{ fontSize: '12px' }}>Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.</p>

			</div>
		);
	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps, { getTickers, getCurrentPrice })(OverviewSummary);
