import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentView from './ContentView';
import AddTickerMenu from './AddTickerMenu';
import NewPortfolioModal from './NewPortfolioModal';
import DeletePortfolioModal from './DeletePortfolioModal';
import { getTickers, getCurrentPrice, addTicker, deleteTicker, getAllPortfolio, updateIndex } from '../actions/portfolioActions';
import { setCurrentUser } from '../actions/authActions';
import { Button } from 'reactstrap';
import { Layout, Icon, Row, Col } from 'antd';
import { Table, Search} from 'semantic-ui-react';
import { Classes, Menu, Popover, MenuDivider, MenuItem, Position, Intent, Divider, HTMLTable} from "@blueprintjs/core";
import { Button as BPButton, ButtonGroup as BPButtonGroup} from "@blueprintjs/core";
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { connect } from 'react-redux';
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
			filteredTickers: [{
				key:'0',
				ticker: 'Loading',
				change: '0',
				price: '0'
			}],
			portfolios: ['Loading'],
			currentPortfolio: 'Watch List',
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
					tickers: res.payload,
				});

				if (this.state.currentPortfolio === 'Holding'){
					this.setState({
						filteredTickers: res.payload.filter(ticker => ticker.quantity > 0)
					});
				} else {
					this.setState({
						filteredTickers: res.payload.filter(ticker => ticker.portfolioName === this.state.currentPortfolio)
					});
				}
			}	
		}).catch(function(err){
			console.log(err);
		});
	}

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
		//var portfolioName = e.target.name;
		var portfolioName = e.target.textContent;
		this.getTickersList();
		this.setState({
			currentPortfolio: portfolioName,
		});

		if (portfolioName === 'Holding'){
			this.setState({
				filteredTickers: this.state.tickers.filter(ticker => ticker.quantity > 0)
			});
		} else {
			this.setState({
				filteredTickers: this.state.tickers.filter(ticker => ticker.portfolioName === portfolioName)
			});
		}
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
			currentPortfolioID: e.target.id,
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
			  			<p style={{color:'red', marginTop:'5px'}}>{change}%</p>
				  		) : (
				  		<p style={{color:'green', marginTop:'5px'}}>{change}%</p>
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
			  			<p style={{marginTop:'5px'}}>{price}</p>
			  		)
			  		}
			  	</Table.Cell>
			</Table.Row>
		);

		const SortableList = SortableContainer(({items}) => {
		  	return (
				<Table selectable size='small' style={{width:'225px', marginLeft: '5px', marginTop: '1px'}}>
				    <Table.Body className = "noselect">
					  	{items.map(({ticker, change, price, _id, quantity}, index) => (
					    	<SortableItem key={`item-${index}`} index={index} ticker={ticker} change={change} price={price} quantity={quantity} id={_id}/>
					    ))}
					</Table.Body>
				</Table>
		  	);
		});

		const listMenu = (
            <Menu>
				<MenuItem onClick={this.setCurrentPortfolio} name='Watch List' text='Watch List'/>
				<MenuItem onClick={this.setCurrentPortfolio} name='Holding' text='Holding'/>
				{this.state.portfolios.map((portfolio) =>
					<div>
					<Row>
						<Col span={this.state.editMode ? 19 : 24}>
							<MenuItem onClick={this.setCurrentPortfolio} name={portfolio.portfolioName} text={portfolio.portfolioName}/>
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
					</div>
				)}
				<Divider/>
				<MenuItem onClick={this.showPortfolioModal} name='Create New List' text='Create New List'/>
            </Menu>
		);
		
		const addTickerMenu = (
			<AddTickerMenu currentPortfolio={this.state.currentPortfolio} getTickersList={this.getTickersList}/>
		)

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
						portfolioID={this.state.currentPortfolioID}
						portfolioName={this.state.deletePortfolioName}
					/>

					<Menu className={Classes.ELEVATION_1} style={{width:'224px', marginTop:'5px', marginBottom: '10px', marginLeft: '5px'}}>
						<MenuItem text="Overview" onClick={this.toOverview}/>
						<Popover content={addTickerMenu} position={Position.BOTTOM}>
							<MenuItem 
								text="Add Ticker"
								style={{width:'215px'}}
							/>
						</Popover>
                	</Menu>
					
					<BPButtonGroup>
						<BPButton
							icon={this.state.editMode ? "small-tick" : "edit"}
							style={{marginLeft: '5px', width:'35px'}}
							onClick={this.enterEdit}
							intent = {this.state.editMode ? Intent.SUCCESS : Intent.NONE}
						/>
						<Popover content={listMenu} position={Position.BOTTOM}>
							<BPButton 
								text={this.state.currentPortfolio}
								rightIcon="caret-down"
								style={{width:'191px'}}
							/>
						</Popover>
					</BPButtonGroup>
					<SortableList lockAxis="y" items={this.state.filteredTickers} onSortEnd={this.onSortEnd} />
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

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice, addTicker, deleteTicker, updateIndex, getAllPortfolio, setCurrentUser})(TickerList);
