import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Row, Col, List } from 'antd';
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
			topLosers: ['']
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

		 //Get market wide news
		 axios.get('https://api.iextrading.com/1.0/stock/market/news/').then(res => {
			this.setState({
				news: res.data
			});
			console.log(res.data);
		});
 	}


  	render() {
    	return (
			<div> 
				<Divider style={{marginTop:'-21px'}}/>
				<Card
					interactive = {true}
					elevation = {Elevation.ONE}
				    style={{ width: 250, marginTop:'10px' }}
				>	
					<h4>Daily Holdings Performance</h4>
				    <p  style={{fontSize:20+'px', color:this.state.textColor}}>
				    	{(this.state.avgPercChange*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%
				    </p>
				</Card>

				<h3 style={{marginTop: '20px'}}>Daily Top Gainers</h3>
				<Row>
					<div style={{width:'800px'}}>
						{this.state.topGainers ? (
							this.state.topGainers.slice(0, 5).map((ticker) => {
								return(
									<Col span={4}>
									<Card
										interactive = {true}
										elevation = {Elevation.ONE}
										style={{ width: 120, marginTop:'10px' }}
										onClick = {() => {this.props.setCurrentTicker(ticker.symbol)}}
									>
										<p>{ticker.symbol}</p>
										<p style={{color:'green'}}>{(ticker.changePercent*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
									</Card>
									</Col>
								)
							})
						):(
							<div />
						)}
					</div>
				</Row>
				
				<h3 style={{marginTop: '20px'}}>Daily Top Losers</h3>
				<Row>
					<div style={{width:'800px'}}>
						{this.state.topLosers ? (
							this.state.topLosers.slice(0, 5).map((ticker) => {
								return(
									<Col span={4}>
									<Card
										interactive = {true}
										elevation = {Elevation.ONE}
										style={{ width: 120, marginTop:'10px' }}
										onClick = {() => {this.props.setCurrentTicker(ticker.symbol)}}
									>
										<p>{ticker.symbol}</p>
										<p style={{color:'red'}}>{(ticker.changePercent*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
									</Card>
									</Col>
								)
							})
						):(
							<div />
						)}
					</div>
				</Row>
				
				<h3 style={{marginTop: '50px'}}>Market Wide News</h3>	
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
				/>
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(OverviewSummary);
