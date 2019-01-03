import React from 'react';
import { connect } from 'react-redux';
import { getCompanyNews } from '../actions/portfolioActions';
import { ListGroup } from 'reactstrap';
import { Divider } from '@blueprintjs/core';
import { List } from 'antd';
import { ItemDescription } from 'semantic-ui-react';

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
				<Divider style={{marginTop:'-21px'}}/>
				<List
					itemLayout="horizontal"
					dataSource={this.state.newsArray}
					size="large"
					renderItem={item => (
					<List.Item>
						<List.Item.Meta
						title={<a href={item.url}>{item.headline}</a>}
						description={new Date(item.datetime).toLocaleDateString() + ' ' + new Date(item.datetime).toLocaleTimeString()}
						/>
					</List.Item>
					)}
				/>
			</div>
		);
  	}
}

const mapStateToProps = state => ({
});
export default connect(mapStateToProps,{getCompanyNews})(NewsList);
