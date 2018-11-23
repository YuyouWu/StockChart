import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Tab, Tabs } from '@blueprintjs/core';
import OverviewSummary from './OverviewSummary'
import MarketOverview from './MarketOverview'

//Class for rendering each individual tickers on portfolio
class Overview extends React.Component {
 	render() {
	    return (
			<div style={{marginTop:'-6px'}}>
				<Tabs id="ContentView">
					<Tab id="Overview" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Overview</p>} panel={<OverviewSummary />} />
					<Tab id="Sectors" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Sectors</p>} panel={<MarketOverview />} />
				</Tabs>				
			</div>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(Overview);
