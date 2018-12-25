import React from 'react';
import { editQuantity } from '../actions/portfolioActions';
import { Menu, FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core";
import { message } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class EditQuantityMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ticker : this.props.ticker,
			tickerId: this.props.tickerId,
			currentQuantity: this.props.quantity,
			newQuantity: ''
		}
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({
			ticker : newProps.ticker,
			tickerId: newProps.tickerId,
			currentQuantity: newProps.quantity,
		});
	}

	quantityOnChange = (e) => {
		this.setState({
			newQuantity: e.target.value
		});
	}

	handleEditQuantity = (e) => {
		e.preventDefault();

		var tickerObj = {
			"_id": this.state.tickerId,
			"quantity": this.state.newQuantity
		}
		this.props.editQuantity(tickerObj).then((res) => {
			this.props.getTickersList();
			message.success('Shares of ' + this.state.ticker + ' have changed from ' + this.state.currentQuantity + ' to ' + this.state.newQuantity);
		});
	}

	render() {
		var currenQuantity = this.state.currentQuantity;
		return (
			<div>
				<Menu style={{ marginLeft: "5px", marginRight: "5px" }}>
					<FormGroup label="Shares" labelFor="quantity">
						<InputGroup
							id="quantity"
							placeholder={currenQuantity}
							onChange={this.quantityOnChange}
						/>
					</FormGroup>
					<Button text="Confirm" style={{ marginBottom: "5px" }} intent={Intent.PRIMARY} onClick={this.handleEditQuantity} />
				</Menu>
			</div>
		);
	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{editQuantity})(EditQuantityMenu);
