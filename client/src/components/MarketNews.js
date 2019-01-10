import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Divider } from '@blueprintjs/core';
import { List } from 'antd';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class MarketNews extends React.Component {
  	constructor(){
 		super();
 		this.state = {
			newsArray: ['']
		 }
 	}

  	componentDidMount(){
		 //Get market wide news
		 axios.get('https://api.iextrading.com/1.0/stock/market/news/').then(res => {
			this.setState({
				newsArray: res.data
			});
		});
 	}


  	render() {
    	return (
			<div>
				<Divider style={{marginTop:'-21px'}}/>
				<List
					itemLayout="horizontal"
					dataSource={this.state.newsArray}
					size="large"
					renderItem={item => (
					<List.Item>
						<List.Item.Meta
						title={<a href={item.url}>{item.headline}</a>}
						description={new Date(item.datetime).toLocaleDateString() + ' ' + new Date(item.datetime).toLocaleTimeString() + ' - ' + item.source}
						/>
					</List.Item>
					)}
				/>
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(MarketNews);
