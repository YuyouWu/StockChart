import React, { Component } from 'react';
import ContentView from './ContentView';
import { getTickers, addTicker } from '../actions/portfolioActions';
import { Form, Input, Button, InputGroup } from 'reactstrap';
import { Layout, Menu, Modal, Icon } from 'antd';
import { connect } from 'react-redux';

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

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
			// var temp = [];
			// for (var i = res.payload.length - 1; i >= 0; i--) {
			// 	temp[i] = res.payload[i].ticker;
			// }
	    	this.setState({
	    		tickers: res.payload
	    	});
		}).catch(function(err){
			console.log(err);
		});
	}

	handleAddTicker = (e) => {
		var temp = [];
	    const ticker = e.target.elements.ticker.value.trim();
	    const quantity = Number(e.target.elements.quantity.value.trim());

	    //TODO: if state to set default quanity as 0

	    temp = this.state.tickers;
		temp.push(ticker);

		var tickerObj = {
			"ticker": ticker,
			"quantity": quantity
		}

		this.props.addTicker(tickerObj);
		this.handleOk();
	}

	setCurrentTicker = (e) => {
		this.setState({
			currentTicker: e.item.props.name
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
				<Button outline color="primary" onClick={this.showModal}>Add Ticker</Button>
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
		          			<Input placeholder="Quantity" type="number" name="quantity"/>
		          		</InputGroup>
			          	<br/>
			          	<h5>Total Cost: </h5>
			          	<br/>
		          		<Button outline color="primary">Add Ticker</Button>
			    	</Form>
		        </Modal>
				<br />
				<Menu 
					defaultSelectedKeys={['Overview']} 
					mode="inline" 
					defaultOpenKeys={['holding']}
					onClick={this.setCurrentTicker}
				>
					<Menu.Item key='Overview' name='Overview'>  
						<Icon type="pie-chart" />
						<span>Overview</span>
					</Menu.Item>
					<SubMenu key="holding" title={<span><Icon type="line-chart"/><span>Holding</span></span>}>
						{
							this.state.tickers.map((tickers, index) => {
								if (tickers.quantity > 0){
									return(
										<Menu.Item key={index} name={tickers.ticker}> 
											{tickers.ticker} - {tickers.quantity} shares
										</Menu.Item>
									)
								}
							})
						}
					</SubMenu>
					<SubMenu key="watchlist" title={<span><Icon type="bars"/><span>Watch List</span></span>}>
						{
							this.state.tickers.map((tickers, index) => {
								if (tickers.quantity === 0){
									return(
										<Menu.Item key={index} name={tickers.ticker}> 
											{tickers.ticker}
										</Menu.Item>
									)
								}
							})
						}
					</SubMenu>
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
