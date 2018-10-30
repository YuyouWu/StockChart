import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Card } from 'antd';

var tickerList = [];
var totalQuantity = 0;
var totalPercChange = 0;
var avgPercChange = 0;
//Class for rendering each individual tickers on portfolio
class Overview extends React.Component {
 	constructor(){
 		super();
 		this.state = {
 			tickerList: [],
 			totalQuantity: 0,
 			avgPercChange: 0,
 			textColor: 'green'
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
 	}

 	render() {
	    return (
	    	<Card
	    		hoverable
			    title="Daily Return"
			    style={{ width: 200 }}
			>
			    <p  style={{fontSize:20+'px', color:this.state.textColor}}>
			    	{(this.state.avgPercChange*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%
			    </p>
			</Card>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(Overview);
