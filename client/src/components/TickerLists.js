import React, { Component } from 'react';
import axios from 'axios';

class TickerList extends Component{
	constructor(props) {
	    super(props);
	    const tickers = [];
	    this.state = {tickers};
	}
	
	getTickers(){
		var that = this;
		axios.get('/portfolio').then(function (res){
			that.setState({
				tickers: res.data.tickers[0].ticker
			});
		}).catch(function(err){
			return(err);
		});
	}

	render() { 
		const {tickers} = this.state
		this.getTickers();
		return(
			<div>
				Ticker: {tickers}
			</div>
		);
	}
}

export default TickerList;