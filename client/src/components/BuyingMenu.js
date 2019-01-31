import React from 'react';
import { editQuantity, getCurrentPrice } from '../actions/portfolioActions';
import { Menu, FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { message } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class BuyingMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ticker : this.props.ticker,
			tickerId: this.props.tickerId,
			currentQuantity: this.props.quantity,
			avgCost: this.props.avgCost,
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
			currentQuantity: newProps.quantity,
			avgCost: newProps.avgCost
		});
	}

	quantityOnChange = (e) => {
		this.setState({
			buyQuantity: e.target.value
		});
	}

	priceOnChange = (e) => {
		this.setState({
			latestPrice: e.target.value
		});
	}

	handleEditQuantity = (e) => {
		e.preventDefault();
		//Calculate Avg Cost
		var currentCost = parseFloat(this.state.latestPrice) * parseFloat(this.state.buyQuantity);
		var originalCost = parseFloat(this.state.currentQuantity) * parseFloat(this.state.avgCost);
		var totalQuantity = parseFloat(this.state.currentQuantity) + parseFloat(this.state.buyQuantity);
		var newAvgCost = (currentCost + originalCost) / totalQuantity

		console.log(newAvgCost);
		var tickerObj = {
			"_id": this.state.tickerId,
			"quantity": parseInt(this.state.buyQuantity) + parseInt(this.state.currentQuantity),
			"buyPrice": this.state.latestPrice,
			"avgCost": newAvgCost
		}
		this.props.editQuantity(tickerObj).then((res) => {
			this.props.getTickersList();
			message.success(this.state.buyQuantity + ' shares of ' + this.state.ticker + ' have been added');
		});
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
export default connect(mapStateToProps,{editQuantity, getCurrentPrice})(BuyingMenu);
