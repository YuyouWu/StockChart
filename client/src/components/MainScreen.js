import React, { Component } from 'react';
import ContentView from './ContentView';
import { getTickers, getCurrentPrice, addTicker, deleteTicker } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
import { Form, Input, Button, InputGroup } from 'reactstrap';
import { Layout, Modal, Icon, Row, Col } from 'antd';
import { Table } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

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
	    	currentTicker: 'Overview',
	    	currentTickerId: 0,
	    	visible: false,
	    	currentUser: '',
	    	selectedOption: null,
	    	forceUpdate: '',
	    	editMode: 'false'
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

	//Updating index after drag and drop 
	onSortEnd = ({oldIndex, newIndex}) => {
	    this.setState({
	    	tickers: arrayMove(this.state.tickers, oldIndex, newIndex),
	    });
	};

	render() {
		const SortableItem = SortableElement(({ticker, change, price, id, quantity}) =>
			<Table.Row>
				<Table.Cell hidden={this.state.editMode}>
			  		<Button size="sm" outline color="danger" id={id} ticker = {ticker}
			  			onClick={(event) =>{
			  				this.props.deleteTicker(id).then((res) => {
								this.getTickersList();
							});
				  		}  				
			 		}>
			  			X
			  		</Button>
			  	</Table.Cell>
			  	<Table.Cell>
			  		<Button color="link" size="sm" id={id} ticker={ticker}
			  			onClick={(event) =>{
							this.setState({
								currentTicker: ticker,
								currentTickerId: id,
								currentQuantity: quantity
							})			  				
			  			}  				
			  		}>
			  			{ticker}
			  		</Button>
			  	</Table.Cell>
			  	<Table.Cell>{change}%</Table.Cell>
			  	<Table.Cell>
			  		{price}
			  	</Table.Cell>
			</Table.Row>
		);

		const SortableList = SortableContainer(({items}) => {
		  	return (
			    <Table selectable size='small'>
			    	<Table.Body className = "noselect">
				      {items.map(({ticker, change, price, _id, quantity}, index) => (
				        <SortableItem key={`item-${index}`} index={index} ticker={ticker} change={change} price={price} quantity={quantity} id={_id}/>
				      ))}
				    </Table.Body>
			    </Table>
		  	);
		});

		return(
			<Layout>
				<Sider
					width={250} style={{ background: '#fff', overflow: 'auto', height: '92vh', overflowX: "hidden", overflowY: "scroll"}}>
					<br />
					<Button outline color="primary" onClick={this.toOverview} style={{marginBottom:10+'px', marginLeft:8+'px', width:220+'px'}}>
						<Icon type="pie-chart" /> Overview
					</Button>
					<Row gutter={10}>
						<Col span={12}>
							<Button outline color="primary" onClick={this.showModal} style={{marginBottom:10+'px', marginLeft:8+'px', width:105+'px'}}>
								Add Ticker
							</Button>
						</Col>
						<Col span={12}>
							<Button outline color="primary" onClick={this.enterEdit} style={{marginBottom:10+'px', width:105+'px'}}>
								{this.state.editMode? (
									<p>Edit</p>
									):(
									<p>Done</p>
								)}
							</Button>
						</Col>
					</Row>
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
					<SortableList lockAxis="y" items={this.state.tickers} onSortEnd={this.onSortEnd} />
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
