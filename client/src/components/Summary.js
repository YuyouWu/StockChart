import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import { Row, Col } from 'antd';
import { Divider } from '@blueprintjs/core';
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
	    	textColor: 'green'
	    }
	    this.loadData = this.loadData.bind(this);
	}

	componentDidMount(){
		this.setState({
			chartData: '',
			notFound: false
		});
		this.loadData(this.props.ticker);

		//get chart data
		axios.get('https://api.iextrading.com/1.0/stock/'+this.props.ticker+'/chart/1y').then((res) => {
			if(res.data){
				res.data.forEach((obj) => {
					obj.date = new Date(obj.date);
				});
				this.setState({
					chartData: res.data
				});
			}
		});
	}

	componentWillReceiveProps(newProps){
		this.setState({
			chartData: '',
			notFound: false
		});
		this.loadData(newProps.ticker);	  	
		//get chart data
		axios.get('https://api.iextrading.com/1.0/stock/'+newProps.ticker+'/chart/5y').then((res) => {
			res.data.forEach((obj) => {
				obj.date = new Date(obj.date);
			});
			this.setState({
				chartData: res.data
			});
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
	}

  	render() {
    	return (
	    	<div>
				<Divider style={{marginTop:'-21px'}}/>
		    	{this.state.priceData && this.state.chartData && this.state.statData ? ( 
		    		<div>
		    			<Row>
		    				<Col>
		    					<h4>{this.props.ticker} - {this.state.statData.companyName}</h4>
		    				</Col>
		    			</Row>
			    		<Row>
				    		<Col span={2}>
					    		<p style={{color:this.state.textColor}}>${this.state.priceData.delayedPrice}</p>
					  		</Col>
				  			<Col span={2}>
				 					<p style={{fontSize:12+'px', color:this.state.textColor}}>{this.state.priceData.change.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
			    			</Col>
				    		<Col span={2}>
				    			<p style={{fontSize:12+'px', color:this.state.textColor}}>{this.state.changePercent.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
					    	</Col>
				    		<Col span={2}>
				    			<p style={{fontSize:12+'px'}}>{this.props.quantity} shares</p>
				    		</Col>
			    		</Row>
						<Chart type="hybrid" data={this.state.chartData} />
					</div>
					) : ( 
					<div>
						{this.state.notFound ? (
								<p>Ticker Symbol Not Found. Please make sure you have the correct ticker.</p>
							):(
								<p>Loading</p>
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
export default connect(mapStateToProps,{getCurrentPrice, getCompanyStat})(Summary);
