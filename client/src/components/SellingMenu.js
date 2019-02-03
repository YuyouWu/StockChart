import React from 'react';
import { editQuantity, getCurrentPrice, addTransaction } from '../actions/portfolioActions';
import { Menu, FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { message } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class SellingMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ticker : this.props.ticker,
			tickerId: this.props.tickerId,
			currentQuantity: this.props.quantity,
			latestPrice: '',
			buyQuantity: ''
		}
		//get price
		this.props.getCurrentPrice(this.state.ticker).then(res => {
			this.setState({
				latestPrice: res.payload.latestPrice
			})
		})
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({
			ticker : newProps.ticker,
			tickerId: newProps.tickerId,
			currentQuantity: this.props.quantity
		});
	}

	quantityOnChange = (e) => {
		this.setState({
			sellQuantity: e.target.value
		});
	}

	priceOnChange = (e) => {
		this.setState({
			latestPrice: e.target.value
		});
	}


	handleEditQuantity = (e) => {
		e.preventDefault();

		if(this.state.sellQuantity > this.state.currentQuantity){
			message.error("Not enough shares to sell");
		} else {
			var tickerObj = {
				"_id": this.state.tickerId,
				"quantity": parseInt(this.state.currentQuantity) - parseInt(this.state.sellQuantity),
				"sellPrice": this.state.latestPrice
			}

			var transactionObj = {
				"ticker": this.state.ticker,
				"quantity": this.state.sellQuantity,
				"date": new Date(),
				"action": "Sell",
				"price": this.state.latestPrice
			}
	
			this.props.editQuantity(tickerObj).then((res) => {
				this.props.getTickersList();
				message.success(this.state.sellQuantity + ' shares of ' + this.state.ticker + ' have been deducted');
				this.props.addTransaction(transactionObj);
			});	
		}
	}

	render() {
		return (
			<div>
				<Menu style={{ marginLeft: "5px", marginRight: "5px" }}>
					<FormGroup label="Shares" labelFor="quantity">
						<InputGroup
							id="quantity"
							placeholder="0"
							onChange={this.quantityOnChange}
						/>
					</FormGroup>
					<FormGroup label="Price" labelFor="price">
						<InputGroup
							id="quantity"
							placeholder={"$" + this.state.latestPrice}
							onChange={this.priceOnChange}
						/>
					</FormGroup>

					<Button text="Confirm" style={{ marginBottom: "5px" }} intent={Intent.PRIMARY} onClick={this.handleEditQuantity} />
				</Menu>
			</div>
		);
	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{editQuantity, getCurrentPrice, addTransaction})(SellingMenu);
