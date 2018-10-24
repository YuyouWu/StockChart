import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import { getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import Summary from './Summary';
import Financial from './Financial';
import NewsList from './NewsList';

const TabPane = Tabs.TabPane;

class ContentView extends Component{
	render() {
		return(
			<div>
				{this.props.ticker !== 'Overview' &&
					<Tabs defaultActiveKey="1">
						<TabPane tab={this.props.ticker} key="1">
							<Summary ticker = {this.props.ticker}/>
						</TabPane>
						<TabPane tab='News' key="2">
							<NewsList ticker = {this.props.ticker}/> 
						</TabPane>
						<TabPane tab='Financial' key="3">
							<Financial ticker = {this.props.ticker}/>
						</TabPane>
					</Tabs>
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCurrentPrice, getCompanyStat})(ContentView);

