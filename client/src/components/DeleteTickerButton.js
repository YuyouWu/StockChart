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
				style = {{marginTop:2+'px'}}
				onClick = {this.deleteTicker} 
				hidden = {this.props.hidden} 
				color="danger" 
				size="sm">
				X
			</Button>
    	);
  	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{deleteTicker})(DeleteTickerButton);
