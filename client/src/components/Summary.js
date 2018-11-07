import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import { Row, Col } from 'antd';
import axios from 'axios';
import Chart from './Chart';

//Class for rendering each individual tickers on portfolio
class Summary extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	priceData: '',
	    	statData: '',
	    	textColor: 'green'
	    }
	    this.loadData = this.loadData.bind(this);
	}

	componentDidMount(){
		this.loadData(this.props.ticker);

		//get chart data
		axios.get('https://api.iextrading.com/1.0/stock/'+this.props.ticker+'/chart/1y').then((res) => {
			res.data.forEach((obj) => {
				obj.date = new Date(obj.date);
			});
			this.setState({
				chartData: res.data
			});
			console.log(res.data);
		});
	}

	componentWillReceiveProps(newProps){
		this.loadData(newProps.ticker);	  	
		//get chart data
		axios.get('https://api.iextrading.com/1.0/stock/'+newProps.ticker+'/chart/5y').then((res) => {
			res.data.forEach((obj) => {
				obj.date = new Date(obj.date);
			});
			this.setState({
				chartData: res.data
			});
			console.log(res.data);
		});

	}

	loadData(ticker){
		//Get current price for ticker 
		this.props.getCurrentPrice(ticker).then((res) => {
			this.setState({
				priceData: res.payload,
				changePercent: res.payload.changePercent * 100
	    	});	
	    	if (this.state.priceData.change > 0){
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
				priceData: null
	    	});
	   	});

	   	//Get company stat 
		this.props.getCompanyStat(ticker).then((res) => {
			this.setState({
				statData: res.payload
	    	});
		}).catch(error => {
	    	this.setState({
				statData: null
	    	});
	   	});
	}

  	render() {
    	return (
	    	<div>
		    	{this.state.priceData && this.state.chartData && this.state.statData ? ( 
		    		<div>
			    		<Row>
							<Col>
								<h4>{this.props.ticker} - {this.state.statData.companyName}</h4>
							</Col>
						</Row>
						<Row>
							<Col span={4}>
								<h4 style={{color:this.state.textColor}}>${this.state.priceData.delayedPrice}</h4>
							</Col>
							<Col span={3}>
								<p style={{fontSize:20+'px', color:this.state.textColor}}>{this.state.priceData.change.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
							</Col>
							<Col span={3}>
								<p style={{fontSize:20+'px', color:this.state.textColor}}>{this.state.changePercent.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
							</Col>
							<Col span={3}>
								<p style={{fontSize:20+'px'}}>{this.props.quantity} shares</p>
							</Col>
						</Row>
						<Row>
							<Chart type="hybrid" data={this.state.chartData} />
						</Row>
						<Row>
							<Col span={8}>
								<p>Open {this.state.priceData.open}</p>
								<p>High {this.state.priceData.high}</p>
								<p>Low {this.state.priceData.low}</p>
								<p>Market Cap {this.state.priceData.marketCap.toLocaleString(undefined)}</p>
								<p>PE Ratio {this.state.priceData.peRatio}</p>
							</Col>
							<Col span={8}>
								<p>52 wk High {this.state.priceData.week52High}</p>
								<p>52 wk Low {this.state.priceData.week52Low}</p>
								<p>EPS {this.state.statData.ttmEPS.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
								<p>Dividend Rate {this.state.statData.dividendRate.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
								<p>Dividend Yield {this.state.statData.dividendYield.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
							</Col>
						</Row>
					</div>
					) : ( 
					<div>
						<p>Loading</p>
					</div>
					)	
				}
			</div>	
    	);
  	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{getCurrentPrice, getCompanyStat})(Summary);
