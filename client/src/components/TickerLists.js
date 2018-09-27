import React, { Component } from 'react';
import Ticker from './Ticker'
import { getTickers, addTicker } from '../actions/portfolioActions';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

//Class for rendering list of tickers
class TickerList extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	tickers: ['Loading']
	    };
    	this.componentDidMount = this.componentDidMount.bind(this);
    	this.handleAddTicker = this.handleAddTicker.bind(this);
	}

	componentDidMount(){
		//API to get the list of tickers
		var test = this.props.getTickers();
		console.log(test);
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
  item: state.item
});

export default connect(mapStateToProps,{getTickers, addTicker})(TickerList);
