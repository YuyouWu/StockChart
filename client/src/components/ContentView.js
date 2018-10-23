import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import Financial from './Financial';
import NewsList from './NewsList';

const TabPane = Tabs.TabPane;

class ContentView extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	currentPrice: 'Loading...',
	    }
	}
	

	componentWillReceiveProps(newProps){
		if (newProps.ticker === 'Overview'){
			this.setState({
				currentPrice: 'Loading...'
	    	});
	    	return(null);
		}

	  	//Get current price for ticker 
		this.props.getCurrentPrice(newProps.ticker).then((res) => {
	   		let priceData = res.payload.delayedPrice;
			this.setState({
				currentPrice: '$' + priceData
	    	});	
		}).catch(error => {
	    	console.log(error);
	   	});

	   	//Get company stat 
		this.props.getCompanyStat(newProps.ticker).then((res) => {
	   		let statData = res.payload;
			this.setState({
				companyName: statData.companyName,
				marketcap: statData.marketcap.toLocaleString(undefined),
				week52high: statData.week52high,
  				week52low: statData.week52low,
  				latestEPS: statData.latestEPS
	    	});
		}).catch(error => {
	    	console.log(error);
	   	});
	}

	render() {
		return(
			<div>
				<Tabs defaultActiveKey="1">
					<TabPane tab={this.props.ticker} key="1">
						{this.props.ticker !== 'Overview' && 
							<div>
								<h4>{this.state.companyName}</h4>
								<h3>{this.state.currentPrice}</h3>
								<p>Market Cap: ${this.state.marketcap}</p>
								<p>52 weeks range: {this.state.week52low} - {this.state.week52high}</p>
								<p>EPS: {this.state.latestEPS}</p>
							</div>	
						}
					</TabPane>
					<TabPane tab='News' key="2">
						<NewsList ticker = {this.props.ticker}/> 
					</TabPane>
					<TabPane tab='Financial' key="3">
						<Financial ticker = {this.props.ticker}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCurrentPrice, getCompanyStat})(ContentView);

