import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Divider } from '@blueprintjs/core';
import { ListGroup } from 'reactstrap';
import NewsItem from './NewsItem';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class MarketNews extends React.Component {
  	constructor(){
 		super();
 		this.state = {
			news: ['']
		 }
 	}

  	componentDidMount(){
		 //Get market wide news
		 axios.get('https://api.iextrading.com/1.0/stock/market/news/').then(res => {
			this.setState({
				news: res.data
			});
		});
 	}


  	render() {
    	return (
			<div>
				<Divider style={{marginTop:'-21px'}}/>
				{this.state.news ? (
					<ListGroup flush>
						{this.state.news.map((newsItem, index) => {
							return(
								<NewsItem news={newsItem} key={index} />
							)
						})}
					</ListGroup>
				):(
					<p>Loading</p>
				)}
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(MarketNews);
