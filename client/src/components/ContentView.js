import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import { getCurrentPrice } from '../actions/portfolioActions';
import axios from 'axios';
const TabPane = Tabs.TabPane;

class ContentView extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	currentPrice: 'Loading'
	    }
    	console.log(this.props);
	}
	

	componentWillReceiveProps(newProps){
		let reqString = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+newProps.ticker+'&apikey=R4VG3S712X7PFH2U';
		axios.get(reqString)
	    .then(response => {
	    	let priceData = response.data["Time Series (Daily)"];
	      	//res.send(priceData[Object.keys(priceData)[0]]["4. close"]);    
	    	this.setState({
				currentPrice: priceData[Object.keys(priceData)[0]]["4. close"]
	    	})
	  	}).catch(error => {
	    	console.log(error);
	    });
		// this.props.getCurrentPrice(newProps.ticker).then (res => this.setState({
		// 	currentPrice: res.payload
		// }));
	}

	render() {
		return(
			<div>
				<Tabs defaultActiveKey="1">
					<TabPane tab={this.props.ticker} key="1">
						<h3>
							${this.state.currentPrice}
						</h3>
						<div>
							Daily Return
						</div>
						<div>
							Monthly Return
						</div>
						<div>
							Annual Return
						</div>
					</TabPane>
					<TabPane tab='News' key="2">Content of {this.props.ticker} News</TabPane>
					<TabPane tab='Financial' key="3">Financial information of {this.props.ticker}</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCurrentPrice})(ContentView);

