import React, { Component } from 'react';
import { Tab, Tabs, FocusStyleManager, Button, Intent, Popover, Position} from '@blueprintjs/core';
import Summary from './Summary';
import Financial from './Financial';
import NewsList from './NewsList';
import Overview from './Overview';
import Screener from './Screener';
import AddTickerSubMenu from './AddTickerSubMenu';
import EditQuantityMenu from './EditQuantityMenu';

// const TabPane = Tabs.TabPane;

class ContentView extends Component{
	constructor(props){
		super(props);
		FocusStyleManager.onlyShowFocusOnTabs();
		this.state = {
			currentTicker: this.props.ticker,
			currentTickerId: this.props.tickerId,
			currentQuantity: this.props.quantity,
			currentPortfolio: this.props.portfolio
		}
	}

	componentWillReceiveProps = (newProps) =>{
		this.setState({
			currentTicker: newProps.ticker,
			currentTickerId: newProps.tickerId,
			currentQuantity: newProps.quantity,
			currentPortfolio: newProps.portfolio
		});
	}

	render() {	
		const addTickerMenu = (
			<AddTickerSubMenu ticker={this.state.currentTicker} currentPortfolio={this.state.currentPortfolio} getTickersList={this.props.getTickersList}/>
		)

		const editQuantityMenu = (
			<EditQuantityMenu ticker={this.state.currentTicker} tickerId={this.state.currentTickerId} quantity={this.state.currentQuantity} getTickersList={this.props.getTickersList}/>
		)

		return(
			<div>
				{this.state.currentTicker === 'Overview' ? (
					<Overview setCurrentTicker = {this.props.setCurrentTicker}/>
				):(
					this.state.currentTicker === 'Screener' ? (
						<Screener/>
					):(
						<div style={{marginTop:'-6px'}}>
							<Tabs id="ContentView">
								<Tab id="Summary" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>{this.state.currentTicker}</p>} panel={<Summary ticker = {this.state.currentTicker} quantity={this.props.quantity}/>} />
								<Tab id="Financial" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Financial</p>} panel={<Financial ticker = {this.state.currentTicker}/>} />
								<Tab id="News" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>News</p>} panel={<NewsList ticker = {this.state.currentTicker}/>} />
								<Popover content={addTickerMenu} position={Position.BOTTOM}>
									<Button 
										intent = {Intent.PRIMARY} 
										style={{marginBottom:'5px'}}
										disabled={this.state.currentPortfolio === 'Holding' ? true : false}
									>
										Add {this.state.currentTicker}
									</Button>
								</Popover>
								<Popover content={editQuantityMenu} position={Position.BOTTOM}>
									<Button 
										intent = {Intent.PRIMARY} 
										style={{marginBottom:'5px'}}
										disabled={this.state.currentTickerId === '' ? true : false}
									>
										Edit Quantity
									</Button>
								</Popover>
							</Tabs>				
						</div>
					)
				)}
			</div>
		);
	}
}

export default ContentView;

