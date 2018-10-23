import React from 'react';
import { connect } from 'react-redux';
import { getCompanyNews } from '../actions/portfolioActions';
import { ListGroup } from 'reactstrap';
import NewsItem from './NewsItem';

class NewsList extends React.Component {
	constructor() {
		super();
		this.state ={
			newsArray : ''
	    };
		this.getNews = this.getNews.bind(this);
	}

	componentDidMount(){
		this.getNews(this.props.ticker);
	}

	componentWillReceiveProps(newProps) {
		this.getNews(newProps.ticker);
	}

	getNews(ticker){
		this.props.getCompanyNews(ticker).then((res) => {
			this.setState({
				newsArray: res.payload
			});
		}).catch(error => {
	    	console.log(error);
	   	});
	}

	render() {
		return (
			<div>
				<ListGroup flush>
					{this.state.newsArray &&
						this.state.newsArray.map((newsItem, index) => {
							return(
								<NewsItem news={newsItem} key={index} />
							)
						})
					}
				</ListGroup>
			</div>
		);
  	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{getCompanyNews})(NewsList);
