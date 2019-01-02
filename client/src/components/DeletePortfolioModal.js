import React from 'react';
import { deletePortfolio } from '../actions/portfolioActions';
import { Form, Button } from 'reactstrap';
import { Modal } from 'antd';
import { connect } from 'react-redux';

//Class for rendering each individual tickers on portfolio
class DeletePortfolioModal extends React.Component {
	handleDeletePortfolio= (e) => {
		e.preventDefault();
        var portfolioId = this.props.portfolioId;
        
		this.props.deletePortfolio(portfolioId).then(res => {
            this.props.getAllPortfolio();
        });
        this.props.hideModal();    
	}

  	render() {
	    return (
	      	<Modal
			    title="Delete Portfolio"
			    visible={this.props.visible}
			    onOk={this.props.hideModal}
			    onCancel={this.props.handleCancel}
			    footer={null}
			>	
			    <Form onSubmit={this.handleDeletePortfolio}>
			        <h3>Are you sure you want to delete the list {this.props.portfolioName}?</h3>
					<br/>
			    <Button outline color="primary">Yes</Button>
				</Form>
			</Modal>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{deletePortfolio})(DeletePortfolioModal);
  