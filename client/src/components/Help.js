import React from 'react';
import { Tab, Tabs } from "@blueprintjs/core";

class Help extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			currentTab: 'FAQ'
		}
	}
	
	handleTabChange = (TabId) => {
		this.setState({
			currentTab: TabId
		});
	}

	render() {
		return(
			<div className="container" style={{marginTop:'20px'}}>
				<Tabs id="Help" onChange={this.handleTabChange} selectedTabId={this.state.currentTab} vertical={true}>
					<Tab id="FAQ" title="FAQ" panel={
						<p>FAQ section coming soon. Please email support@plusfolio.com for any questions.</p>
					} />
					<Tab id="Contact" title="Contact" panel={
						<p>Contact our support at this email address: support@plusfolio.com</p>
					} />
				</Tabs>
			</div>
		);
	}
}

export default Help;