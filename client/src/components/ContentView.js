import React, { Component } from 'react';
import { Tab, Tabs, FocusStyleManager, Divider } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { setCurrentUser } from '../actions/authActions';
import Summary from './Summary';
import Financial from './Financial';
import NewsList from './NewsList';
import Overview from './Overview';

// const TabPane = Tabs.TabPane;

class ContentView extends Component{
	constructor(props){
		super(props);
		FocusStyleManager.onlyShowFocusOnTabs();
	}
	
	render() {		  
		return(
			<div>
				{this.props.ticker !== 'Overview' ? (
					<div style={{marginTop:'-6px'}}>
						<Tabs id="ContentView">
							<Tab id="Summary" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>{this.props.ticker}</p>} panel={<Summary ticker = {this.props.ticker} quantity={this.props.quantity}/>} />
							<Tab id="News" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>News</p>} panel={<NewsList ticker = {this.props.ticker}/>} />
							<Tab id="Financial" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Financial</p>} panel={<Financial ticker = {this.props.ticker}/>} />
						</Tabs>				
					</div>
				) : (
					<Overview />
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{setCurrentUser})(ContentView);

