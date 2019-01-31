import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentView from './ContentView';
import AddTickerMenu from './AddTickerMenu';
import NewPortfolioModal from './NewPortfolioModal';
import DeletePortfolioModal from './DeletePortfolioModal';
import { getTickers, getCurrentPrice, addTicker, deleteTicker, getAllPortfolio, updateIndex } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
import { Button } from 'reactstrap';
import { Layout, Row, Col, message } from 'antd';
import { Search} from 'semantic-ui-react';
import { Classes, Menu, Popover, MenuItem, Position, Intent, Divider, HTMLTable} from "@blueprintjs/core";
import { Button as BPButton, ButtonGroup as BPButtonGroup} from "@blueprintjs/core";
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/last');

const { Content, Sider } = Layout;

//For rendering ticker search result
const resultRenderer = ({ symbol, name }) => <div>
	<p> {symbol} - {name}</p>
</div>
resultRenderer.propTypes = {
  symbol: PropTypes.string,
  description: PropTypes.string,
}

var tickerList = '';
var tempTickerObj = [];
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
			filteredTickers: [{
				key:'0',
				ticker: 'Loading',
				change: '0',
				price: '0'
			}],
			portfolios: ['Loading'],
			currentPortfolio: 'Watch List',
			currentPortfolioId: 'WatchList',
			avgCost:'',
			allTickers: [''],
	    	currentTicker: 'Overview',
	    	currentTickerId: 0,
			visible: false,
			portfolioModalTogle: false,
			deletePortfolioModalTogle: false,
	    	currentUser: '',
	    	selectedOption: null,
			forceUpdate: '',
			dropdownOpen: false,
	    	editMode: false
		};		
	}

	componentDidMount(){
		socket.on('message', (message) => {
			//console.log(message);
			var symbol = JSON.parse(message).symbol;
			var price = JSON.parse(message).price;
			this.updatePrice(symbol, price);
		});

		this.getTickersList();
		this.getAllPortfolio();

		//Get all symbols for tickers
		axios.get("https://api.iextrading.com/1.0/ref-data/symbols").then(res => {
			this.setState({
				allTickers: res.data
			});
		});
	}

	componentWillMount() {
    	this.resetComponent();
	}
	
	//Real time price update based on LAST subscription from IEX
	updatePrice = (symbol, price) => {
		var res = this.state.filteredTickers.findIndex(stock => stock.ticker === symbol);
		//Temp solution
		if (res >= 0){
			var previousClose = tempTickerObj[res].previousClose;
			tempTickerObj[res].price = price;
			tempTickerObj[res].change = (((price - previousClose)/previousClose)*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2});
			this.setState({
				filteredTickers: tempTickerObj
			});	
		}	
	}

	getTickersList = () => {
		//API to get the list of tickers
		this.props.getTickers().then((res) => {
			if(res.payload) {
				var i = 0;
				//WIP: convert tickers to a list of string
				//Subscribe to last or tops here 
				//return object for rendering 


				res.payload.forEach((obj) => {
					obj.key = i;
					obj.edit = false;
					i++;
					this.props.getCurrentPrice(obj.ticker).then((res) =>{
						obj.price = res.payload.latestPrice;
						obj.change = (res.payload.changePercent * 100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2}); 
						obj.previousClose = res.payload.previousClose;
						this.setState({
							forceUpdate: ''
						});
					});

					tickerList = tickerList + obj.ticker + ',';
				});

				//Subsribe to LAST socket 
				socket.on('connect', () => {
					socket.emit('subscribe', tickerList);
				});
				
				//sort tickers based on their index value 
				res.payload.sort((a, b) => {
		    		return a.index - b.index;
		    	});
		    	this.setState({
					tickers: res.payload,
				});

				if (this.state.currentPortfolioId === 'Holding'){
					this.setState({
						filteredTickers: res.payload.filter(ticker => ticker.quantity > 0)
					}, () => {
						tempTickerObj = this.state.filteredTickers;
					});
				} else {
					this.setState({
						filteredTickers: res.payload.filter(ticker => ticker.portfolioId === this.state.currentPortfolioId)
					}, () => {
						tempTickerObj = this.state.filteredTickers;
					});
				}
			}	
		}).catch(function(err){
			console.log(err);
		});
	}
	
	
	//function to batch requet on filtered ticker and return quotes
	//use table to display returned symbol, change percent, and price 
	//run every minute in render()

	getAllPortfolio = () => {
		this.props.getAllPortfolio().then((res) => {
			if(res.payload) {
				this.setState({
					portfolios: res.payload.portfolio
				});
			}
		});
	}

	setCurrentPortfolio = (e) =>{
		//Why does it sometimes print parentNode?
		var portfolioId = '';
		if(e.target.id){
			portfolioId = e.target.id;
		} else {
			portfolioId = e.target.parentNode.id;
		}
		this.getTickersList();
		this.setState({
			currentPortfolio: e.target.textContent,
			currentPortfolioId: portfolioId
		});

		if (e.target.textContent === 'Holding'){
			this.setState({
				filteredTickers: this.state.tickers.filter(ticker => ticker.quantity > 0)
			}, () => {
				tempTickerObj = this.state.filteredTickers;
			});
		} else {
			this.setState({
				filteredTickers: this.state.tickers.filter(ticker => ticker.portfolioId === this.state.currentPortfolioId)
			}, () => {
				tempTickerObj = this.state.filteredTickers;
			});
		}
	}
	
	setCurrentTicker = (ticker) => {
		this.setState({
			currentTicker: ticker
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

	showPortfolioModal = () => {
    	this.setState({
      		portfolioModalTogle: true,
    	});
  	}

  	hidePortfolioModal = (e) => {
	    this.setState({
			portfolioModalTogle: false,
	    });
	}

	handlePortfolioCancel = (e) => {
	    this.setState({
	      portfolioModalTogle: false,
	    });
	}

	showDeletePortfolioModal = (e) => {
    	this.setState({
			deletePortfolioModalTogle: true,
			currentPortfolioId: e.target.id,
			deletePortfolioName: e.target.name
    	});
  	}

  	hideDeletePortfolioModal = (e) => {
	    this.setState({
			deletePortfolioModalTogle: false,
	    });
	}

	handleDeletePortfolioCancel = (e) => {
	    this.setState({
			deletePortfolioModalTogle: false,
	    });
	}

	toggleDropDown = () => {
		this.setState(prevState => ({
		  dropdownOpen: !prevState.dropdownOpen
		}));
	}

	//Edit Portfolio Lists
	enterEdit = () => {
		this.setState(prevState => ({
			editMode: !prevState.editMode,
		}));
	}

	//Updating index after drag and drop 
	onSortEnd = ({oldIndex, newIndex}) => {
	    this.setState({
	    	tickers: arrayMove(this.state.tickers, oldIndex, newIndex),
	    	filteredTickers: arrayMove(this.state.filteredTickers, oldIndex, newIndex),
	    });
		this.state.tickers.forEach((ticker) => {
	    	ticker.index = this.state.tickers.indexOf(ticker);
			this.props.updateIndex(ticker);
		});
		this.state.filteredTickers.forEach((ticker) => {
	    	ticker.index = this.state.filteredTickers.indexOf(ticker);
			this.props.updateIndex(ticker);
		});
	};

	//For searching Ticker
	resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });
	handleResultSelect = (e, { result }) => this.setState({ value: result.symbol, currentTicker: result.symbol, currentTickerId: '' });
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
		
		const SortableItem = SortableElement(({ticker, change, price, id, quantity, avgCost}) =>
			<tr>
			  	<td>
					<div style={{width:'50px'}}>
						<Button 
							color="link" 
							onClick={(event) =>{
								this.setState({
									currentTicker: ticker,
									currentTickerId: id,
									currentQuantity: quantity,
									avgCost: avgCost
								});		  				
							}}
							style={{cursor: 'pointer'}}
						>
							{ticker}
						</Button>
					</div>
			  	</td>
			  	<td>
			  		{change < 0 ? (
			  			<p style={{color:'red', marginTop:'5px', fontSize:'13px'}}>{change}%</p>
				  		) : (
				  		<p style={{color:'green', marginTop:'5px', fontSize:'13px'}}>{change}%</p>
				  		)
			  		}
			  	</td>
			  	<td>
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
						price &&
							<p style={{marginTop:'5px', fontSize:'13px'}}>{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
						
			  		)}
			  	</td>
			</tr>
		);

		const SortableList = SortableContainer(({items}) => {
		  	return (
				<HTMLTable 
					condensed = {true}
					interactive = {true}
					striped = {true}
					className = 'noselect'
					style={{width:'225px', marginLeft: '5px', marginTop: '-1px', marginRight: '5px'}}
				>
					<tbody>
						{items.map(({ticker, change, price, _id, quantity, avgCost}, index) => (
					    	<SortableItem key={`item-${index}`} index={index} ticker={ticker} change={change} price={price} quantity={quantity} avgCost={avgCost} id={_id}/>
					    ))}
					</tbody>
				</HTMLTable>
		  	);
		});

		const listMenu = (
            <Menu>
				<MenuItem onClick={this.setCurrentPortfolio} id='WatchList' text='Watch List'/>
				<MenuItem onClick={this.setCurrentPortfolio} id='Holding' text='Holding'/>
				{this.state.portfolios.map((portfolio) =>
					<Row>
						<Col span={this.state.editMode ? 19 : 24}>
							<MenuItem onClick={this.setCurrentPortfolio} id={portfolio._id} text={portfolio.portfolioName}/>
						</Col>
						<Col span={4}>
							<BPButton 
								hidden={!this.state.editMode} 
								text='X' 
								small 
								intent={Intent.DANGER} 
								style={{marginLeft:'5px'}}
								onClick = {this.showDeletePortfolioModal}
								id={portfolio._id}
								name={portfolio.portfolioName}
							/>
						</Col>
					</Row>
				)}
				<Divider/>
				<MenuItem onClick={this.showPortfolioModal} name='Create New List' text='Create New List'/>
            </Menu>
		);
		
		const addTickerMenu = (
			<AddTickerMenu currentPortfolio={this.state.currentPortfolio} currentPortfolioId={this.state.currentPortfolioId} getTickersList={this.getTickersList}/>
		)

		return(
			<Layout>
				<Sider
					width={250} style={{ background: '#fff', overflow: 'auto', height: '95vh', overflowX: "hidden"}}>
					<div style={{width:'235px'}}>
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
					</div>
					
					<NewPortfolioModal 
						hideModal={this.hidePortfolioModal} 
						showModal={this.showPortfolioModal} 
						handleCancel={this.handlePortfolioCancel} 
						visible={this.state.portfolioModalTogle}
						getAllPortfolio={this.getAllPortfolio}
					/>

					<DeletePortfolioModal 
						hideModal={this.hideDeletePortfolioModal} 
						showModal={this.showDeletePortfolioModal} 
						handleCancel={this.handleDeletePortfolioCancel} 
						visible={this.state.deletePortfolioModalTogle}
						getAllPortfolio={this.getAllPortfolio}
						portfolioId={this.state.currentPortfolioId}
						portfolioName={this.state.deletePortfolioName}
					/>

					<Menu className={Classes.ELEVATION_1} style={{width:'224px', marginTop:'5px', marginBottom: '10px', marginLeft: '5px'}}>
						<MenuItem text="Overview" 
							onClick={() => {
								this.setState({
									currentTicker: 'Overview',
									currentTickerId: '',
									currentQuantity: 0
								});	
			  				}}
						/>
						<MenuItem text="Screener"
							onClick={() => {
								this.setState({
									currentTicker: 'Screener',
									currentTickerId: '',
									currentQuantity: 0
								});	
			  				}}
						/>
						<Popover content={addTickerMenu} position={Position.BOTTOM}>
							<MenuItem 
								text="Add Ticker"
								style={{width:'214px'}}
							/>
						</Popover>
                	</Menu>
					
					<BPButtonGroup>
						<BPButton
							icon={this.state.editMode ? "small-tick" : "edit"}
							style={{marginLeft: '5px', width:'35px'}}
							onClick={this.enterEdit}
							intent = {this.state.editMode ? Intent.SUCCESS : Intent.PRIMARY}
						/>
						<Popover content={listMenu} position={Position.BOTTOM}>
							<BPButton 
								text={this.state.currentPortfolio}
								rightIcon="caret-down"
								style={{width:'191px'}}
								intent = {Intent.PRIMARY}
							/>
						</Popover>
					</BPButtonGroup>
					<SortableList lockAxis="y" items={this.state.filteredTickers} onSortEnd={this.onSortEnd} />
			    </Sider>
        		<Content style={{ background: '#fff', padding: 24, margin: 0, minWidth: 600, minHeight: 280, height: '95vh' }}>
		            <div>
						<ContentView 
							ticker={this.state.currentTicker} 
							tickerId={this.state.currentTickerId} 
							quantity={this.state.currentQuantity}
							avgCost={this.state.avgCost}
							portfolio={this.state.currentPortfolio}
							portfolioId={this.state.currentPortfolioId}
							setCurrentTicker={this.setCurrentTicker}
							getTickersList={this.getTickersList}
						/>
			        </div>
			    </Content>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice, addTicker, deleteTicker, updateIndex, getAllPortfolio, setCurrentUser})(TickerList);
