import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Row, Col, Table } from 'antd';
import { Card, Elevation, Divider } from "@blueprintjs/core";
import axios from 'axios';

var tickerList = [];
var totalQuantity = 0;
var totalPercChange = 0;
var avgPercChange = 0;
//Class for rendering each individual tickers on portfolio
class OverviewSummary extends React.Component {
  	constructor(){
 		super();
 		this.state = {
 			tickerList: [],
 			totalQuantity: 0,
 			avgPercChange: 0,
			textColor: 'green',
			topGainers: [''],
			topLosers: [''],
			sectorData: ['']
 		}
	}
	 
  	componentDidMount(){
 		tickerList = [];
		totalQuantity = 0;
		totalPercChange = 0;
		avgPercChange = 0;

 		//Get tickers and total quantity of shares owned
 		this.props.getTickers().then((res) => {
 			var tickers = res.payload;
 			tickers.forEach((element) => {
 				if (element.quantity > 0){
 					tickerList.push(element);
 					totalQuantity = totalQuantity + element.quantity;
 				}
  			});
  			this.setState({
 				tickerList: tickerList,
 				totalQuantity: totalQuantity
 			});

	 		this.state.tickerList.forEach((tickerObj) => {
	 			this.props.getCurrentPrice(tickerObj.ticker).then((res) => {
		 			totalPercChange = totalPercChange + (res.payload.changePercent * tickerObj.quantity)
		 			avgPercChange = totalPercChange / this.state.totalQuantity;
		 			this.setState({
		 				avgPercChange: avgPercChange
		 			});
		 			if (this.state.avgPercChange > 0){
				    	this.setState({
							textColor: 'green'
				    	});	
			    	} else {
			    		this.setState({
							textColor: 'red'
				    	});	
			    	}
		 		});
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
		axios.get('https://api.iextrading.com/1.0/stock/market/sector-performance').then(res =>{
			this.setState({
				sectorData: res.data
			});
		});
 	}


  	render() {
		const columns = [{
			title:'Symbol',
			dataIndex: 'symbol',
			key:'symbol',
			render: (text) => {
				return (
					<Button 
						color="link"
						onClick = {() => this.props.setCurrentTicker(text)}
					>
						{text}
					</Button>
				)
			}
		}, {
			title:'Change',
			dataIndex: 'changePercent',
			key:'changePercent',
			render: (text) => {
				return (
					text > 0 ? (
						<p style={{color:'green'}}>{(text*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>					
					):(
						<p style={{color:'red'}}>{(text*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
					)
				)
			}
		}];

    	return (
			<div> 
				<Divider style={{marginTop:'-21px'}}/>
				<h3>Daily Holdings Performance</h3>
				<Card
					elevation = {Elevation.ONE}
				    style={{ width: 130, marginTop:'10px' }}
				>	
				    <p  style={{fontSize:20+'px', color:this.state.textColor}}>
				    	{(this.state.avgPercChange*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%
				    </p>
				</Card>

				<h3 style={{marginTop: '40px'}}>Daily Sector Performance</h3>
				<Row>
					<div style={{width:'850px'}}>
						{ this.state.sectorData ? (
							this.state.sectorData.map((sector) => {
								return(
									<Col span={4}>
										<Card
											elevation = {Elevation.ONE}
											style={{ width: 130, height: 120,marginTop:'15px' }}
										>
											<p>{sector.name}</p>
											{sector.performance < 0 ? (
											<p style={{color:'red'}}>{(sector.performance*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
											): (
											<p style={{color:'green'}}>{(sector.performance*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
											)}
										</Card>
									</Col>
								)
							})
						):(
							<p>Loading</p>
						)}
					</div>
				</Row>

				<Row style={{marginTop: '20px'}}>
					<Col span={4} style={{marginRight: '20px'}}>
					<h3 style={{marginTop: '20px'}}>Top Gainers</h3>
					<Table 
						dataSource={this.state.topGainers} 
						columns={columns} 
						showHeader={false} 
						pagination={false}/>
					</Col>
					<Col span={4}>
					<h3 style={{marginTop: '20px'}}>Top Losers</h3>
					<Table 
						dataSource={this.state.topLosers} 
						columns={columns} 
						showHeader={false} 
						pagination={false}
					/>
					</Col>
				</Row>
				
				{/* <h3 style={{marginTop: '50px'}}>Market Wide News</h3>	
				<List
					itemLayout="vertical"
					dataSource={this.state.news}
					renderItem={item => (
					<List.Item>
						<List.Item.Meta
						title={<a href={item.url}>{item.headline}</a>}
						description={item.source + " - " + item.datetime}
						/>
						{item.summary}
					</List.Item>
					)}
				/> */}
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(OverviewSummary);
