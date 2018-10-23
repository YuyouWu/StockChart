import React, { Component } from 'react';

class FinancialField extends Component{
	render() {
		return (
			<div>
				{this.props.data ? (
					<p> {this.props.data} </p>
				) : (
					<p> - </p>
				)}
			</div>
		);
	}
}

export default FinancialField;
