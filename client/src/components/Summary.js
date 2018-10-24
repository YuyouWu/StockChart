import React from 'react';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';

//Class for rendering each individual tickers on portfolio
class Summary extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	priceData: '',
	    	statData: ''
	    }
	    this.loadData = this.loadData.bind(this);
	}

	componentDidMount(){
		this.loadData(this.props.ticker);
	}

	componentWillReceiveProps(newProps){
		this.loadData(newProps.ticker);	  	
	}

	loadData(ticker){
		//Get current price for ticker 
		this.props.getCurrentPrice(ticker).then((res) => {
			this.setState({
				priceData: res.payload
	    	});	
	    	console.log(this.state.priceData);
		}).catch(error => {
	    	console.log(error);
	   	});

	   	//Get company stat 
		this.props.getCompanyStat(ticker).then((res) => {
			this.setState({
				statData: res.payload
	    	});
	    	console.log(this.state.statData);
		}).catch(error => {
	    	console.log(error);
	   	});
	}

  	render() {
    	return (
	    	<div>
		    	{this.state.priceData && this.state.statData ? ( 
					<div>
						<h4>{this.state.statData.companyName}</h4>
						<h4>{this.state.priceData.delayedPrice}</h4>
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
