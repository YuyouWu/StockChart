import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { deleteTicker } from '../actions/portfolioActions';

//Class for rendering each individual tickers on portfolio
class DeleteTickerButton extends React.Component {
	deleteTicker = (e) => {
		this.props.deleteTicker(this.props.tickerId).then((res) => {
			this.props.updateTickersList();
		});
	}

	render() {
    	return (
			<Button 
				onClick = {this.deleteTicker} 
				hidden = {this.props.hidden}
				outline size="sm" 
				color="danger" 
				style={{marginRight: 5+'px'}}>
				X
			</Button>
    	);
  	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{deleteTicker})(DeleteTickerButton);
