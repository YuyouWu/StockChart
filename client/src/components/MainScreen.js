import React, { Component } from 'react';
import ContentView from './ContentView';
import { getTickers, addTicker } from '../actions/portfolioActions';
import { Col, Row, Form, Input, Button, InputGroup, InputGroupAddon} from 'reactstrap';
import { Layout, Menu, Modal } from 'antd';
import { connect } from 'react-redux';

const { Content, Sider } = Layout;

//Class for rendering list of tickers
class TickerList extends Component{
	constructor() {
	    super();
	    this.state = {
	    	tickers: ['Loading'],
	    	currentTicker: 'Overview',
	    	visible: false
	    };
    	this.handleAddTicker = this.handleAddTicker.bind(this);
    	this.setCurrentTicker = this.setCurrentTicker.bind(this);
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
		console.log("here");
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();

	    temp = this.state.tickers;
		temp.push(ticker);

		var tickerObj = {
			"ticker": ticker
		}

		this.props.addTicker(tickerObj);
		this.handleOk();
	}

	setCurrentTicker = (e) => {
		this.setState({
			currentTicker: e.key
		});
	}

	//Handle Modal Logic
	showModal = () => {
    	this.setState({
      		visible: true,
    	});
  	}

  	handleOk = (e) => {
	    this.setState({
	      visible: false,
	    });
	}

  	handleCancel = (e) => {
	    this.setState({
	      visible: false,
	    });
	}


	render() { 
		return(
			<Layout>
				<Sider width={200} style={{ background: '#fff' }}>
				<br />
				<Button size= "large" color="secondary" onClick={this.showModal}>Add Ticker</Button>
				<br />
				<Modal
		          title="Add New Ticker"
		          visible={this.state.visible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		          footer={null}
				>	
		          	<Form onSubmit={this.handleAddTicker}>
		          		<InputGroup>
		          			<Input placeholder="Ticker" type="text" name="ticker"/>
		          			<Input placeholder="Quantity" type="number"/>
		          		</InputGroup>
			          	<br/>
			          	<h5>Total Cost: </h5>
			          	<br/>
		          		<Button>Add Ticker</Button>
			    	</Form>
		        </Modal>
				<br />
				<Menu defaultSelectedKeys={['Overview']}  onClick={this.setCurrentTicker}>
					<Menu.Item key='Overview'> 
						Overview 
					</Menu.Item>
					{
						this.state.tickers.map((ticker) => <Menu.Item key={ticker}> {ticker} </Menu.Item>)
					}
				</Menu>
			    </Sider>
        		<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
		            <div>
						<ContentView ticker = {this.state.currentTicker}/>
			        </div>
			    </Content>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, addTicker})(TickerList);
