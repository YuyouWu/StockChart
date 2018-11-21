import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Tab, Tabs } from '@blueprintjs/core';
import OverviewSummary from './OverviewSummary'

const TabPane = Tabs.TabPane;

//Class for rendering each individual tickers on portfolio
class Overview extends React.Component {
 	render() {
	    return (
			<div style={{marginTop:'-6px'}}>
				<Tabs id="ContentView">
					<Tab id="Overview" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Overview</p>} panel={<OverviewSummary />} />
					<Tab id="Tools" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Tools</p>} panel={<div />} />
				</Tabs>				
			</div>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(Overview);
