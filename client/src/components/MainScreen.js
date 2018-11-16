import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentView from './ContentView';
import AddTickerModal from './AddTickerModal';
import { getTickers, getCurrentPrice, addTicker, deleteTicker, updateIndex } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
import { Button } from 'reactstrap';
import { Layout, Icon } from 'antd';
import { Table, Menu, Dropdown, Search} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import axios from 'axios';
import _ from 'lodash';
const { Content, Sider } = Layout;

//For rendering ticker search result
const resultRenderer = ({ symbol, name }) => <div>
	<p> {symbol} - {name}</p>
</div>
resultRenderer.propTypes = {
  symbol: PropTypes.string,
  description: PropTypes.string,
}

//Class for rendering list of tickers
class TickerList extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	activeItem: 'Overview',
	    	tickers: [{
				key:'0',
				ticker: 'Loading',
				change: '0',
				price: '0'
			}],
			allTickers: [''],
	    	currentTicker: 'Overview',
	    	currentTickerId: 0,
	    	visible: false,
	    	currentUser: '',
	    	selectedOption: null,
	    	forceUpdate: '',
	    	editMode: false
	    };
	}

	componentDidMount(){
		this.getTickersList();
		axios.get("https://api.iextrading.com/1.0/ref-data/symbols").then(res => {
			this.setState({
				allTickers: res.data
			});
		});
	}

	componentWillMount() {
    	this.resetComponent();
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
				//sort tickers based on their index value 
				res.payload.sort((a, b) => {
		    		return a.index - b.index;
		    	});
		    	this.setState({
		    		tickers: res.payload
		    	});
	    	}
		}).catch(function(err){
			console.log(err);
		});
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
  	hideModal = (e) => {
	    this.setState({
	      visible: false,
	    });
	}
  	handleCancel = (e) => {
	    this.setState({
	      visible: false,
	    });
	}

	//Edit Portfolio Lists
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
	    this.state.tickers.forEach((ticker) => {
	    	ticker.index = this.state.tickers.indexOf(ticker);
			this.props.updateIndex(ticker);
	    });
	};

	//For searching Ticker
	resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });
	handleResultSelect = (e, { result }) => this.setState({ value: result.symbol, currentTicker: result.symbol });
	handleSearchChange = (e, { value }) => {
	    this.setState({ isLoading: true, value })

	    setTimeout(() => {
	      	if (this.state.value.length < 1) return this.resetComponent();

	      	const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
	      	const isMatch = result => re.test(result.symbol)||re.test(result.name);
	      	this.setState({
	        	isLoading: false,
	        	results: _.filter(this.state.allTickers, isMatch).splice(0,10)
	      	});
	    }, 1000);
  	}


	render() {
		const { isLoading, value, results } = this.state;
		
		const SortableItem = SortableElement(({ticker, change, price, id, quantity}) =>
			<Table.Row>
			  	<Table.Cell collapsing>
			  		<Button color="link" onClick={(event) =>{
			  				console.log("clicked");
							this.setState({
								currentTicker: ticker,
								currentTickerId: id,
								currentQuantity: quantity
							})			  				
			  			}}
			  			style={{cursor: 'pointer'}}>
			  			{ticker}
			  		</Button>
			  	</Table.Cell>
			  	<Table.Cell collapsing>
			  		{change < 0 ? (
			  			<p style={{color:'red'}}>{change}%</p>
				  		) : (
				  		<p style={{color:'green'}}>{change}%</p>
				  		)
			  		}
			  	</Table.Cell>
			  	<Table.Cell collapsing>
			  		{this.state.editMode ? (
			  			<Button size="sm" outline color="danger" id={id} ticker = {ticker}
				  			onClick={(event) =>{
				  				this.props.deleteTicker(id).then((res) => {
									this.getTickersList();
								});
					  		}
			 			}>
			  				X
			  			</Button>
			  		):(
			  			<p>{price}</p>
			  		)
			  		}
			  	</Table.Cell>
			</Table.Row>
		);

		const SortableList = SortableContainer(({items}) => {
		  	return (
				<Table selectable size='small' style={{width:'225px', marginLeft: '5px'}}>
				    <Table.Body className = "noselect">
					  	{items.map(({ticker, change, price, _id, quantity}, index) => (
					    	<SortableItem key={`item-${index}`} index={index} ticker={ticker} change={change} price={price} quantity={quantity} id={_id}/>
					    ))}
					</Table.Body>
				</Table>
		  	);
		});

		const options = [
			  { key: 1, text: 'Holding', value: 1 },
			  { key: 2, text: 'Watch List', value: 2 },
			  { key: 3, text: 'Create New List', value: 3 },
		]

		return(
			<Layout>
				<Sider
					width={250} style={{ background: '#fff', overflow: 'auto', height: '94vh', overflowX: "hidden"}}>
					<Search input={{ fluid: true }} style={{ marginTop:'10px', marginBottom:'10px', marginLeft:'5px', marginRight:'5px'}}
						placeholder="Look Up Ticker"
						resultRenderer={resultRenderer}
					    loading={isLoading}
					    onResultSelect={this.handleResultSelect}
					    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
					    results={results}
					    value={value}
					    {...this.props}
					/>
					<Menu vertical style={{width:'225px', marginTop:'5px', marginLeft: '5px'}}>
				        <Menu.Item name='Overview' onClick={this.toOverview}>
				        	<Icon type="pie-chart" style={{marginRight: '5px'}}/> Overview
				        </Menu.Item>
				        <Menu.Item name='Add Ticker' onClick={this.showModal}>
							<Icon type="file-add" style={{marginRight: '5px'}}/> Add Ticker
				        </Menu.Item>
				        <Menu.Item name='Edit' onClick={this.enterEdit}>
							{!this.state.editMode? (
								<p><Icon type="edit" style={{marginRight: '5px'}}/> Edit List</p>
								):(
								<p><Icon type="check" style={{marginRight: '5px'}}/> Done</p>
							)}
				        </Menu.Item>
				    </Menu>
					<AddTickerModal 
						hideModal={this.hideModal} 
						showModal={this.showModal} 
						handleCancel={this.handleCancel} 
						visible={this.state.visible}
						getTickersList={this.getTickersList}
					/>
				    <Dropdown style={{width:'225px', marginLeft: '5px'}} placeholder='Watch List' selection options={options} />
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
export default connect(mapStateToProps,{getTickers, getCurrentPrice, addTicker, deleteTicker, updateIndex, setCurrentUser})(TickerList);
