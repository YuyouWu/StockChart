import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import OverviewSummary from './OverviewSummary'

const TabPane = Tabs.TabPane;

//Class for rendering each individual tickers on portfolio
class Overview extends React.Component {
 	render() {
	    return (
	    	<div>
				<Tabs defaultActiveKey="1">
					<TabPane tab='Overview' key="1">
						<OverviewSummary />
					</TabPane>
					<TabPane tab='Tools' key="2">
					</TabPane>
				</Tabs>
			</div>
	    );
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(Overview);
