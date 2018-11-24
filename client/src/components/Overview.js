import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import OverviewSummary from './OverviewSummary'
import MarketNews from './MarketNews'

//Class for rendering each individual tickers on portfolio
class Overview extends React.Component {
 	render() {
	    return (
			<div style={{marginTop:'-6px'}}>
				<Tabs id="ContentView">
					<Tab id="Overview" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Overview</p>} panel={<OverviewSummary setCurrentTicker={this.props.setCurrentTicker}/>} />
					<Tab id="Market News" title={<p style={{fontSize:'15px', marginBottom: '10px'}}>Market News</p>} panel={<MarketNews />} />
				</Tabs>				
			</div>
	    );
  	}
}

export default Overview;
