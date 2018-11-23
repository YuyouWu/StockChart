import React from 'react';
import { addTicker, getAllPortfolio } from '../actions/portfolioActions';
import { Menu, FormGroup, InputGroup, Button} from "@blueprintjs/core";
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class AddTickerMenu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentPortfolio: this.props.currentPortfolio,
			ticker: '',
			quantity: 0,
		}
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({
			currentPortfolio: newProps.currentPortfolio
		});
	}

	tickerOnChange = (e) =>{
		this.setState({
			ticker: e.target.value.toUpperCase()
		});
	}

	quantityOnChange = (e) =>{
		this.setState({
			quantity: e.target.value
		});
	}

	handleAddTicker = (e) => {
		e.preventDefault();
		
		var tickerObj = {
			"ticker": this.state.ticker,
			"quantity": this.state.quantity,
			"portfolioName": this.props.currentPortfolio
		}
		
		this.props.addTicker(tickerObj).then((res) =>{
			this.props.getTickersList();
		});
	}

  	render() {
	    return (
			<Menu style={{marginLeft:"5px", marginRight:"5px"}}>
				<FormGroup label="Ticker Symbol" labelFor="ticker" style={{marginTop:"5px"}}>
					<InputGroup 
						id="ticker" 
						placeholder="Ticker Symbol" 
						onChange={this.tickerOnChange}
					/>
				</FormGroup>
				<FormGroup label="Quantity" labelFor="quantity" labelInfo="default 0">
					<InputGroup 
						id="quantity" 
						placeholder="0"
						onChange={this.quantityOnChange}
					/>
				</FormGroup>
				<Button text="Add Ticker" style={{marginBottom:"5px"}} onClick={this.handleAddTicker}/>
			</Menu>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{addTicker, getAllPortfolio})(AddTickerMenu);
  