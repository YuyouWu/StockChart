import React, { Component } from 'react';
import ContentView from './ContentView';
import DeleteTickerButton from './DeleteTickerButton';
import { getTickers, getCurrentPrice, addTicker, deleteTicker } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
import { Form, Input, Button, InputGroup } from 'reactstrap';
import { Layout, Modal, Icon, Table, Row, Col } from 'antd';
import { connect } from 'react-redux';
const { Content, Sider } = Layout;

//Class for rendering list of tickers
class TickerList extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	tickers: [{
				key:'0',
				ticker: 'Loading',
				change: '0',
				price: '0'
			}],
			columns: [
				{
				  title: 'Ticker',
				  dataIndex: 'ticker',
				  key: 'ticker',
				  width: '10%',
				  render: text => <p>{text}</p>
				},
				{
				  title: 'Change',
				  dataIndex: 'change',
				  key: 'change',
				  width: '10%',
				  render: (text,record) => <div>
				  	{record.change < 0 ? (
				  		<p style={{color:'red'}}>{text}%</p>
				  	) : (
				  		<p style={{color:'green'}}>{text}%</p>
				  	)}
				  </div>
				},
				{
				  title: 'Price',
				  dataIndex: 'price',
				  key: 'price',
				  width: '10%',
				  render: (text,record) => <Row>
				  	<Col span={16}>
				  		<p>${text}</p>
				  	</Col>
				  	<Col span={1}>
				  		<DeleteTickerButton updateTickersList = {this.getTickersList} hidden = {!record.edit} tickerId = {this.state.currentTickerId} /> 
				  	</Col>
				  	</Row>
				}
			],
	    	currentTicker: 'Overview',
	    	currentTickerId: 0,
	    	visible: false,
	    	currentUser: '',
	    	selectedOption: null,
	    	forceUpdate: ''
	    };
    	this.handleAddTicker = this.handleAddTicker.bind(this);
	}

	componentDidMount(){
		this.getTickersList();
	}

	getTickersList = () => {
		//API to get the list of tickers
		this.props.getTickers().then((res) => {
			if(res.payload) {
				var i = 0;
				res.payload.forEach((obj) => {
					obj.key = i;
					obj.edit = false;
					i++;
					this.props.getCurrentPrice(obj.ticker).then((res) =>{
						obj.price = res.payload.delayedPrice;
						obj.change = (res.payload.changePercent * 100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2}); 
						this.setState({
							forceUpdate: ''
						});
					});
				});
		    	this.setState({
		    		tickers: res.payload
		    	});
	    	}
		}).catch(function(err){
			console.log(err);
		});
	}

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
			"quantity": quantity
		}

		this.props.addTicker(tickerObj).then((res) =>{
			this.getTickersList();
		});
		this.handleOk();
	}

	toOverview = () => {
		this.setState({
			currentTicker: 'Overview',
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
				<Sider
					width={250} style={{ background: '#fff', overflow: 'auto', height: '92vh', overflowX: "hidden", overflowY: "scroll"}}>
					<br />
					<Button outline color="primary" onClick={this.showModal} style={{marginBottom:10+'px', marginLeft:8+'px', width:220+'px'}}>
						Add Ticker
					</Button>
					<Button outline color="primary" onClick={this.toOverview} style={{marginLeft:8+'px', width:220+'px'}}>
						<Icon type="pie-chart" /> Overview
					</Button>
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
					<Table
						size="small"
						showHeader={false}
						columns={this.state.columns} 
						dataSource={this.state.tickers} 
						pagination={false}
						onRow={(record) => {
						    return {
						      	onClick: () => {
							      	this.setState({
										currentTicker: record.ticker,
										currentTickerId: record._id,
										currentQuantity: record.quantity
									});
						      	},
						      	onMouseEnter: () => {
									this.setState({
										currentTickerId: record._id
									});
									record.edit = true
								},
						      	onMouseLeave: () => {
						      		this.setState({
										currentTickerId: record._id
									});
									record.edit = false
								}
						    };
						}}
					/>
			    </Sider>
        		<Content style={{ background: '#fff', padding: 24, margin: 0, minWidth: 600, minHeight: 280 }}>
		            <div>
						<ContentView ticker = {this.state.currentTicker} tickerId = {this.state.currentTickerId} quantity={this.state.currentQuantity}/>
			        </div>
			    </Content>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getTickers, getCurrentPrice, addTicker, deleteTicker, setCurrentUser})(TickerList);
