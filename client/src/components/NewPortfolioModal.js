import React from 'react';
import { newPortfolio } from '../actions/portfolioActions';
import { Form, InputGroup, Input, Button } from 'reactstrap';
import { Modal, message } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class NewPortfolioModal extends React.Component {
	handleNewPortfolio= (e) => {
		e.preventDefault();
		var portfolioName =  e.target.elements.portfolioName.value.trim();
		
		var portfolioObj = {
			"portfolioName": portfolioName
		}

		this.props.newPortfolio(portfolioObj).then(res => {
			this.props.getAllPortfolio();
			message.success('New list ' + portfolioName + ' created.');			
        });
		this.props.hideModal();
	}

  	render() {
	    return (
	      	<Modal
			    title="Create New List"
			    visible={this.props.visible}
			    onOk={this.props.hideModal}
			    onCancel={this.props.handleCancel}
			    footer={null}
			>	
			    <Form onSubmit={this.handleNewPortfolio}>
			        <InputGroup>
						<Input placeholder="List Name" type="string" name="portfolioName"/>
			        </InputGroup>
					<br/>
			    <Button outline color="primary">Create New List</Button>
				</Form>
			</Modal>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{newPortfolio})(NewPortfolioModal);
  