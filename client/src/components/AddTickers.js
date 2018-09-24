import React, { Component } from 'react';
import axios from 'axios';

class AddTickers extends Component{	
	handleAddTicker = (e) => {
		e.preventDefault();
		var that = this;
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();

		axios.get('/portfolio').then(function (res){
			for (var i = res.data.tickers.length - 1; i >= 0; i--) {
				temp[i] = res.data.tickers[i].ticker;
			}
			temp.push(ticker);
			console.log(temp);
	    	that.setState({
	    		tickers: temp
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	render() { 
		return(
	        <form onSubmit={this.handleAddTicker}>
	          <input type="text" name="ticker" />
	          <button>Add Ticker</button>
	        </form>
		);
	}
}

export default AddTickers;