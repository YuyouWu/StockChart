import React, { Component } from 'react';
import Ticker from './Ticker'
import { getTickers, addTicker } from '../actions/portfolioActions';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

//Class for rendering list of tickers
class TickerList extends Component{
	constructor() {
	    super();
	    this.state = {
	    	tickers: ['Loading']
	    };
    	this.handleAddTicker = this.handleAddTicker.bind(this);
	}

	componentDidMount(){
		//API to get the list of tickers
		this.props.getTickers().then((res) => {
			var temp = [];
			for (var i = res.payload.length - 1; i >= 0; i--) {
				temp[i] = res.payload[i].ticker;
			}
	    	this.setState({
	    		tickers: temp
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	handleAddTicker = (e) => {
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();

	    temp = this.state.tickers;
		temp.push(ticker);

		var tickerObj = {
			"ticker": ticker
		}

		this.props.addTicker(tickerObj);
	}

	render() { 
		return(
			<div>
				<br />
		        <form onSubmit={this.handleAddTicker}>
		          <input type="text" name="ticker" />
		          <Button>Add Ticker</Button>
		        </form>
		        {
		          this.state.tickers.map((ticker) => <Ticker key={ticker} tickerText={ticker} />)
		        }
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, addTicker})(TickerList);
