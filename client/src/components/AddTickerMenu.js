import React from 'react';
import { addTicker, getAllPortfolio } from '../actions/portfolioActions';
import { Menu, FormGroup, InputGroup, Button, Intent} from "@blueprintjs/core";
import { message } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class AddTickerMenu extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentPortfolioId: this.props.currentPortfolioId,
			currentPortfolio: this.props.currentPortfolio,
			ticker: '',
			quantity: 0,
		}
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({
			currentPortfolioId: newProps.currentPortfolioId,
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
			"portfolioId": this.state.currentPortfolioId
		}
	
		this.props.addTicker(tickerObj).then((res) =>{
			this.props.getTickersList();
			message.success(this.state.quantity + ' shares of ' + this.state.ticker + ' is added to ' + this.state.currentPortfolio);
		});
	}

  	render() {
	    return (
			<div>
			{this.state.currentPortfolio !== 'Holding' ? (
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
						<Button text="Add Ticker" style={{marginBottom:"5px"}} intent = {Intent.PRIMARY} onClick={this.handleAddTicker}/>
					</Menu>
			):(
				<Menu style={{marginLeft:"5px", marginRight:"5px", width:"200px"}}>
					<p style={{marginTop:"5px", marginBottom:"5px"}}>Cannot add ticker directly to list Holding. Select another list and specify quantity of shares when adding new tickers.</p>
				</Menu>
			)}
			</div>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{addTicker, getAllPortfolio})(AddTickerMenu);
  