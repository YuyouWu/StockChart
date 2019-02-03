import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Row, Col, Table } from 'antd';
import { Card, Elevation, Divider, HTMLTable } from "@blueprintjs/core";
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class MarketPerformance extends React.Component {
	constructor() {
		super();
		this.state = {
			textColor: 'green',
			topGainers: [''],
			topLosers: [''],
			sectorData: [''],
			loading: true,
			forceUpdate: ''
		}
	}

	componentDidMount() {
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
					text >= 0 ? (
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
export default connect(mapStateToProps, { getTickers, getCurrentPrice })(MarketPerformance);
