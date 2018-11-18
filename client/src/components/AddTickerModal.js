import React from 'react';
import { addTicker, getAllPortfolio } from '../actions/portfolioActions';
import { Form, InputGroup, Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Modal } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class AddTickerModal extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			portfolios: this.props.portfolios,
			dropdownOpen: false,
			currentPortfolio: ''
		}
		if(this.props.currentPortfolio === 'Holding') {
			this.setState({
				currentPortfolio: 'Watch List'
			});
		}else{
			this.setState({
				currentPortfolio: this.props.currentPortfolio
			});
		}
	}

	componentWillReceiveProps(newProps){
		this.setState({
			portfolios: this.props.portfolios,
		});
		if(newProps.currentPortfolio === 'Holding') {
			this.setState({
				currentPortfolio: 'Watch List'
			});
		}else{
			this.setState({
				currentPortfolio: newProps.currentPortfolio
			});
		}
	}

	handleAddTicker = (e) => {
		e.preventDefault();
		var ticker =  e.target.elements.ticker.value.trim().toUpperCase();
		var quantity = 0; //Set default quantity to 0
		var portfolioName = this.state.currentPortfolio; //Set default portfolio name to current portfolio
		if(e.target.elements.quantity.value !== null){
	    	quantity = Number(e.target.elements.quantity.value.trim());
		}
		
		var tickerObj = {
			"ticker": ticker,
			"quantity": quantity,
			"portfolioName": portfolioName
		}

		this.props.addTicker(tickerObj).then((res) =>{
			this.props.getTickersList();
		});
		this.props.hideModal();
	}

	setCurrentPortfolio = (e) =>{
		this.setState({
			currentPortfolio: e.target.name
		});
	}

	toggle = () => {
		this.setState(prevState => ({
		  dropdownOpen: !prevState.dropdownOpen
		}));
	}

  	render() {
	    return (
	      	<Modal
			    title="Add New Ticker"
			    visible={this.props.visible}
			    onOk={this.props.hideModal}
			    onCancel={this.props.handleCancel}
			    footer={null}
			>	
			    <Form onSubmit={this.handleAddTicker}>
			        <InputGroup>
						<Input placeholder="Ticker" type="string" name="ticker"/>
						<Input placeholder="Quantity - default 0" type="number" name="quantity"/>
			        </InputGroup>
					<h4> Add To List: </h4>
					<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
						<DropdownToggle outline style={{width: '190px'}} caret>
						{this.state.currentPortfolio}
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem style={{width: '190px'}} onClick={this.setCurrentPortfolio} name='Watch List'>Watch List</DropdownItem>
							{this.state.portfolios.map((portfolio) => 
							<DropdownItem style={{width: '190px'}} onClick={this.setCurrentPortfolio} name={portfolio.portfolioName}>{portfolio.portfolioName}</DropdownItem>
							)}
						</DropdownMenu>
					</Dropdown>
				    <br/>
			    <Button outline color="primary">Add Ticker</Button>
				</Form>
			</Modal>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{addTicker, getAllPortfolio})(AddTickerModal);
  