import React, { Component } from 'react';
import { getCompanyFinancial } from '../actions/portfolioActions';
import FinancialField from './FinancialField';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

class Financial extends Component{
	constructor(props) {
	    super(props);
	    this.state ={
	    	mostRecentQuarter: '',
	    	mostRecentQuarter2: '',
	    	mostRecentQuarter3: '',
	    	mostRecentQuarter4: ''
	    };

	    this.getFinancial = this.getFinancial.bind(this);
	}

	componentDidMount(){
		this.getFinancial(this.props.ticker);
	}

	componentWillReceiveProps(newProps) {
		this.getFinancial(newProps.ticker);
	}

	getFinancial(ticker) {
		this.props.getCompanyFinancial(ticker).then((res) =>{
			console.log(res.payload)
			this.setState({
	    		mostRecentQuarter: res.payload.financials[0],
	    		mostRecentQuarter2: res.payload.financials[1],
	    		mostRecentQuarter3: res.payload.financials[2],
	    		mostRecentQuarter4: res.payload.financials[3],
	    	});
		}).catch(error => {
	    	console.log(error);
	   	});
	}

	render() {
		return (
			<div>
			<Table size="sm" hover responsive>
				<tbody>
					<tr>
						<th>Report Date</th>
						<th><FinancialField data = {this.state.mostRecentQuarter.reportDate} /></th>
						<th><FinancialField data = {this.state.mostRecentQuarter2.reportDate} /></th>
						<th><FinancialField data = {this.state.mostRecentQuarter3.reportDate} /></th>
						<th><FinancialField data = {this.state.mostRecentQuarter4.reportDate} /></th>
					</tr>
					<tr>
						<th>Total Revenue</th>
					  	<td><FinancialField data = {this.state.mostRecentQuarter.totalRevenue} /></td>
					  	<td><FinancialField data = {this.state.mostRecentQuarter2.totalRevenue} /></td>
					  	<td><FinancialField data = {this.state.mostRecentQuarter3.totalRevenue} /></td>
					  	<td><FinancialField data = {this.state.mostRecentQuarter4.totalRevenue} /></td>
					</tr>
					<tr>
						<th>Cost of Revenue</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.costOfRevenue} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.costOfRevenue} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.costOfRevenue} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.costOfRevenue} /></td>
					</tr>
					<tr>
						<th>Gross Profit</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.grossProfit} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.grossProfit} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.grossProfit} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.grossProfit} /></td>
					</tr>
					<tr>
						<th>Operating Expense</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.operatingExpense} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.operatingExpense} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.operatingExpense} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.operatingExpense} /></td>
					</tr>
					<tr>
						<th>Research Development</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.researchAndDevelopment} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.researchAndDevelopment} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.researchAndDevelopment} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.researchAndDevelopment} /></td>
					</tr>
					<tr>
						<th>Operating Income</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.operatingIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.operatingIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.operatingIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.operatingIncome} /></td>
					</tr>
					<tr>
						<th>Net Income</th>
			  			<td><FinancialField data = {this.state.mostRecentQuarter.netIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter2.netIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter3.netIncome} /></td>
			  			<td><FinancialField data = {this.state.mostRecentQuarter4.netIncome} /></td>
					</tr>
				</tbody>
			</Table>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCompanyFinancial})(Financial);
