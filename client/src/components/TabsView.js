import React, { Component } from 'react';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class TabsView extends Component{
	render() {
		return(
			<div>
				<Tabs defaultActiveKey="1">
					<TabPane tab="Overview" key="1">Content of Tab Pane 1</TabPane>
					<TabPane tab="AMZN" key="2">Content of Tab Pane 2</TabPane>
					<TabPane tab="MSFT" key="3">Content of Tab Pane 3</TabPane>
				</Tabs>
			</div>
		);
	}
}
export default TabsView;
