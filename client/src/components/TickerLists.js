import React, { Component } from 'react';
import Ticker from './Ticker'
import { getTickers, addTicker } from '../actions/portfolioActions';
import { ListGroup, Col, Row, Button, Form, Input, InputGroup, InputGroupAddon} from 'reactstrap';
import { connect } from 'react-redux';

//Class for rendering list of tickers
class TickerList extends Component{
	constructor() {
	    super();
	    this.state = {
	    	tickers: ['Loading']
	    };
    	this.handleAddTicker = this.handleAddTicker.bind(this);
	}

	componentDidMount(){
		//API to get the list of tickers
		this.props.getTickers().then((res) => {
			var temp = [];
			for (var i = res.payload.length - 1; i >= 0; i--) {
				temp[i] = res.payload[i].ticker;
			}
	    	this.setState({
	    		tickers: temp
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	handleAddTicker = (e) => {
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();

	    temp = this.state.tickers;
		temp.push(ticker);

		var tickerObj = {
			"ticker": ticker
		}

		this.props.addTicker(tickerObj);
	}

	render() { 
		return(
			<div>
				<br />
		        <Form onSubmit={this.handleAddTicker}>
		        	<Row>
		        		<Col xs="3">
					        <InputGroup>
						        <Input type="text" name="ticker"/>
						        <InputGroupAddon addonType="append">
						        	<Button color="secondary">Add Ticker</Button>
						        </InputGroupAddon>
						    </InputGroup>
				    	</Col>
				    </Row>
			    </Form>
				<br />
				<Row>
			        <Col xs="3">
						<ListGroup>
				        {
				          this.state.tickers.map((ticker) => <Ticker key={ticker} tickerText={ticker} />)
				        }
				        </ListGroup>
			        </Col>
			    </Row>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, addTicker})(TickerList);
