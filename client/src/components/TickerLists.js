import React, { Component } from 'react';
import Ticker from './Ticker'
import TabsView from './TabsView'
import { getTickers, addTicker } from '../actions/portfolioActions';
import { ListGroup, Col, Row, Button, Form, Input, InputGroup, InputGroupAddon} from 'reactstrap';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';

const { Content, Sider } = Layout;
const { SubMenu, MenuItemGroup } = Menu;

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
			<Layout>
				<Sider width={200} style={{ background: '#fff' }}>
				<br />
		        <Form onSubmit={this.handleAddTicker}>
		        	<Row>
		        		<Col>
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
			        <Col>
						<Menu defaultSelectedKeys={['Summary']}>
							<Menu.Item key='Summary'> 
								Summary 
							</Menu.Item>
					        {
					          this.state.tickers.map((ticker) => <Menu.Item key={ticker}> {ticker} </Menu.Item>)
					        }
				        </Menu>
			        </Col>
			    </Row>
			    </Sider>
        		<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
				    <TabsView/>
			    </Content>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, addTicker})(TickerList);
