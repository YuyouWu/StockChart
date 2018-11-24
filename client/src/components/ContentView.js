import React, { Component } from 'react';
import { Tab, Tabs, FocusStyleManager } from '@blueprintjs/core';
import Summary from './Summary';
import Financial from './Financial';
import NewsList from './NewsList';
import Overview from './Overview';

// const TabPane = Tabs.TabPane;

class ContentView extends Component{
	constructor(props){
		super(props);
		FocusStyleManager.onlyShowFocusOnTabs();
		this.state = {
			currentTicker: this.props.ticker
		}
	}

	setCurrentTicker = (ticker) => {
		this.setState({
			currentTicker: ticker
		});
	}

	componentWillReceiveProps = (newProps) =>{
		this.setState({
			currentTicker: newProps.ticker
		});
	}
	
	render() {		  
		return(
			<div>
				{this.state.currentTicker !== 'Overview' ? (
					<div style={{marginTop:'-6px'}}>
						<Tabs id="ContentView">
							<Tab id="Summary" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>{this.state.currentTicker}</p>} panel={<Summary ticker = {this.state.currentTicker} quantity={this.props.quantity}/>} />
							<Tab id="News" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>News</p>} panel={<NewsList ticker = {this.state.currentTicker}/>} />
							<Tab id="Financial" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Financial</p>} panel={<Financial ticker = {this.state.currentTicker}/>} />
						</Tabs>				
					</div>
				) : (
					<Overview setCurrentTicker = {this.setCurrentTicker}/>
				)}
			</div>
		);
	}
}

export default ContentView;

