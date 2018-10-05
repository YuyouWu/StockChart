import React, { Component } from 'react';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class ContentView extends Component{
	render() {
		return(
			<div>
				<Tabs defaultActiveKey="1">
					<TabPane tab={this.props.ticker} key="1">
						<div>
							Daily Return
						</div>
						<div>
							Monthly Return
						</div>
						<div>
							Annual Return
						</div>
					</TabPane>
					<TabPane tab='News' key="2">Content of {this.props.ticker} News</TabPane>
					<TabPane tab='Financial' key="3">Financial information of {this.props.ticker}</TabPane>
				</Tabs>
			</div>
		);
	}
}
export default ContentView;
