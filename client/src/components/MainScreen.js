import React, { Component } from 'react';
import ContentView from './ContentView';
import DeleteTickerButton from './DeleteTickerButton';
import { getTickers, addTicker, deleteTicker } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
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
	    	currentTickerId: 0,
	    	visible: false,
	    	currentUser: '',
	    	selectedOption: null,
	    	editMode: false,
	    };
    	this.handleAddTicker = this.handleAddTicker.bind(this);
    	this.setCurrentTicker = this.setCurrentTicker.bind(this);
	}

	componentDidMount(){
		this.getTickersList()
	}

	getTickersList = () => {
		//API to get the list of tickers
		this.props.getTickers().then((res) => {
			if(res.payload) {
		    	this.setState({
		    		tickers: res.payload
		    	});
	    	}
		}).catch(function(err){
			console.log(err);
		});
	}

	handleAddTicker = (e) => {
		var ticker =  e.target.elements.ticker.value.trim();
		var quantity = 0;

	    //Set default quantity to 0
	    if(e.target.elements.quantity.value !== null){
	    	quantity = Number(e.target.elements.quantity.value.trim());
	    }

		var tickerObj = {
			"ticker": ticker,
			"quantity": quantity
		}

		this.props.addTicker(tickerObj);
		this.handleOk();
	}

	setCurrentTicker = (e) => {
		this.setState({
			currentTicker: e.item.props.name,
			currentTickerId: e.item.props.id
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

	enterEdit = () => {
		this.setState(prevState => ({
			editMode: !prevState.editMode
		}));
	}

	render() { 
		return(
			<Layout>
				<Sider width={200} style={{ background: '#fff' }}>
				<br />
				<Button outline color="primary" onClick={this.showModal} style={{marginRight: 5+'px'}}>Add Ticker</Button>
				{this.state.editMode ? (
					<Button outline color="primary" onClick={this.enterEdit}>Done</Button>
				):(
					<Button outline color="primary" onClick={this.enterEdit}>Edit</Button>				
				)}
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
		          			<Input placeholder="Ticker" type="string" name="ticker"/>
		          			<Input placeholder="Quantity - default 0" type="number" name="quantity"/>
		          		</InputGroup>
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
										<Menu.Item key={index} name={tickers.ticker} id={tickers.ticker}> 
											<DeleteTickerButton updateTickersList = {this.getTickersList} hidden = {!this.state.editMode} tickerId = {tickers._id} />
											{tickers.ticker} - {tickers.quantity} shares
										</Menu.Item>
									)
								} else {
									return(null)
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
											<DeleteTickerButton updateTickersList = {this.getTickersList} hidden = {!this.state.editMode} tickerId = {tickers._id} />
											{tickers.ticker}
										</Menu.Item>
									)
								} else {
									return(null)
								}
							})
						}
					</SubMenu>
				</Menu>
			    </Sider>
        		<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
		            <div>
						<ContentView ticker = {this.state.currentTicker} tickerId = {this.state.currentTickerId}/>
			        </div>
			    </Content>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, addTicker, deleteTicker, setCurrentUser})(TickerList);
