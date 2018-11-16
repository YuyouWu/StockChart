import React from 'react';
import { addTicker } from '../actions/portfolioActions';
import { Form, InputGroup, Input, Button } from 'reactstrap';
import { Modal } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class AddTickerModal extends React.Component {

	handleAddTicker = (e) => {
		e.preventDefault();
		var ticker =  e.target.elements.ticker.value.trim().toUpperCase();
		var quantity = 0;

	    //Set default quantity to 0
	    if(e.target.elements.quantity.value !== null){
	    	quantity = Number(e.target.elements.quantity.value.trim());
	    }

		var tickerObj = {
			"ticker": ticker,
			"quantity": quantity,
			"portfolioList": 'WatchList'
		}

		this.props.addTicker(tickerObj).then((res) =>{
			this.props.getTickersList();
		});
		this.props.hideModal();
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
				    <br/>
			    <Button outline color="primary">Add Ticker</Button>
				</Form>
			</Modal>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{addTicker})(AddTickerModal);
  