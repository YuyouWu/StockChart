import React from 'react';
import { ListGroupItem } from 'reactstrap';

class NewsItem extends React.Component {
	render() {
		return (
			<ListGroupItem>
				<a href={this.props.news.url}>{this.props.news.headline}</a>
				<p>{this.props.news.summary}</p>
			</ListGroupItem>
		);
  }
}

export default NewsItem;
