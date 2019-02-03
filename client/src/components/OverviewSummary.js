import React from 'react';
import { getTickers, getCurrentPrice, getTransaction } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Row, Col, Table, Layout } from 'antd';
import { Card, Elevation, Divider, HTMLTable } from "@blueprintjs/core";
import axios from 'axios';

const { Footer } = Layout;

var tickerList = [];
var totalQuantity = 0;
var dayChange = 0;
var totalValue = 0;
var totalChange = 0;
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
			dayChange: 0,
			textColor: 'green',
			topGainers: [''],
			topLosers: [''],
			sectorData: [''],
			loading: true,
			forceUpdate: '',
			transactionList: [],
		}
	}

	componentDidMount() {
		tickerList = [];
		totalQuantity = 0;
		dayChange = 0;
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
						element.lifetimeChange = element.value - (parseFloat(element.avgCost) * element.quantity);

						tickerList.push(element);

						totalValue = totalValue + element.value;
						dayChange = dayChange + (res.payload.change * element.quantity)
						totalChange = parseFloat(totalChange) + parseFloat(element.lifetimeChange);

						this.setState({
							forceUpdate: element,
							tickerList: tickerList,
							totalQuantity: totalQuantity,
							totalValue: totalValue,
							dayChange: dayChange,
							totalChange: totalChange
						});
					});
				}
			});
		});

		this.props.getTransaction().then((res) => {
			this.setState({
				transactionList: res.payload.transactions,
			});
		});
	}


	render() {

		const columns = [{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
		}, {
			title: 'Symbol',
			dataIndex: 'ticker',
			key: 'ticker',
		}, {
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
		}, {
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
		}, {
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			defaultSortOrder: 'ascend',
			sorter: (a, b) => new Date(b.date) - new Date(a.date)
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
							<th style={{width:'50px'}}>Symbol</th>
							<th style={{width:'100px', textAlign:'right'}}>Price</th>
							<th style={{width:'100px', textAlign:'right'}}>Avg Cost</th>
							<th style={{width:'120px', textAlign:'right'}}>Total Change</th>
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
									<td style={{textAlign:'right'}}>{element.avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
									{
										element.lifetimeChange >= 0 ? (
											<td style={{color: 'green', textAlign:'right'}}>{element.lifetimeChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										):(
											<td style={{color: 'red', textAlign:'right'}}>{element.lifetimeChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										)
									}
									{
										element.change >= 0 ? (
											<td style={{color: 'green', textAlign:'right'}}>{element.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										):(
											<td style={{color: 'red', textAlign:'right'}}>{element.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
										)
									}
									{
										element.changePercent >= 0 ? (
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
							<td></td>
							{
								this.state.totalChange >= 0 ? (
									<td style={{color: 'green', textAlign:'right', fontWeight:'bold'}}>{this.state.totalChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
								):(
									<td style={{color: 'red', textAlign:'right', fontWeight:'bold'}}>{this.state.totalChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
								)
							}
							{
								this.state.dayChange >= 0 ? (
									<td 
										style={{
											color: 'green', 
											textAlign:'right', 
											fontWeight:'bold'
										}}
									>
										{(this.state.dayChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>
								):(
									<td 
										style={{
											color: 'red', 
											textAlign:'right', 
											fontWeight:'bold'
										}}
									>
										{(this.state.dayChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									</td>	
								)
							}
							{
								this.state.dayChange >= 0 ? (
									<td 
										style={{
											color: 'green', 
											textAlign:'right', 
											fontWeight:'bold'
										}}>
											{(this.state.dayChange/(this.state.totalValue - this.state.dayChange)*100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
									</td>
									):(
									<td 
										style={{
											color: 'red', 
											textAlign:'right', 
											fontWeight:'bold'
										}}>
											{(this.state.dayChange/(this.state.totalValue - this.state.dayChange)*100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
									</td>
									)
							}
							<td></td>
							<td></td>
							<td style={{textAlign:'right', fontWeight:'bold'}}>{this.state.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
						</tr>
					</tbody>
				</HTMLTable>
				
				<h3 style={{marginTop:'50px'}}>Transaction History</h3>
				<div style={{width:'950px'}}>
					<Table dataSource={this.state.transactionList} columns={columns}></Table>
				</div>
				
				<Divider style={{ marginTop: '20px' }} />
				<Footer style={{backgroundColor: 'white'}}>
					<p style={{ fontSize: '12px' }}>Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.</p>
				</Footer>
			</div>
		);
	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps, { getTickers, getCurrentPrice, getTransaction })(OverviewSummary);
