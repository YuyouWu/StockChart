import React from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class NewsItem extends React.Component {
	constructor(props) {
		super(props);
	}

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
