import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
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
			 console.log(res.data);
		 });
		 axios.get('https://api.iextrading.com/1.0/stock/market/list/losers').then(res => {
			 this.setState({
				 topLosers: res.data
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
				    style={{ width: 250, marginTop:'10px' }}
				>	
					<h4>Daily Holdings Performance</h4>
				    <p  style={{fontSize:20+'px', color:this.state.textColor}}>
				    	{(this.state.avgPercChange*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%
				    </p>
				</Card>
				<h3>Daily Top Gainers</h3>
				<Row style={{marginBottom: '10px'}}>
				{this.state.topGainers ? (
					this.state.topGainers.map((ticker) => {
						return(
							<Col span={3}>
							<Card
								interactive = {true}
								elevation = {Elevation.ONE}
								style={{ width: 140, marginTop:'10px' }}
							>
								<p>{ticker.symbol}</p>
								<p>{(ticker.changePercent*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
							</Card>
							</Col>
						)
					})
				):(
					<div />
				)}
				</Row>
			
				<Row style={{marginTop:'30px' }}>
				<h3>Daily Top Losers</h3>
				{this.state.topLosers ? (
					this.state.topLosers.map((ticker) => {
						return(
							<Col span={3}>
							<Card
								interactive = {true}
								elevation = {Elevation.ONE}
								style={{ width: 140, marginTop:'10px' }}
							>
								<p>{ticker.symbol}</p>
								<p>{(ticker.changePercent*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
							</Card>
							</Col>
						)
					})
				):(
					<div />
				)}
				</Row>
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(OverviewSummary);
