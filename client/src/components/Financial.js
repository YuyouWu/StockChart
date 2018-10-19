import React, { Component } from 'react';
import { getCompanyFinancial } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import axios from 'axios';

class Financial extends Component{
	constructor(props) {
	    super(props);
	    this.state ={
	    	reportDate: '',
	    	totalRenevue: '',
	    	costOfRevenue: '',
	    	grossProfit: '',
	    	operatingExpense: '',
	    	researchAndDevelopment: '',
	    	operatingIncome: '',
	    	netIncome: ''
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
			this.setState({
	    		reportDate: res.payload.financials[0].reportDate,
	    		totalRevenue: res.payload.financials[0].totalRevenue,
	    		costOfRevenue: res.payload.financials[0].costOfRevenue,
	    		grossProfit: res.payload.financials[0].grossProfit,
	    		operatingExpense: res.payload.financials[0].operatingExpense,
	    		researchAndDevelopment: res.payload.financials[0].researchAndDevelopment,
	    		operatingIncome: res.payload.financials[0].operatingIncome,
	    		netIncome: res.payload.financials[0].netIncome
	    	});
		}).catch(error => {
	    	console.log(error);
	   	});
	}

	render() {
		return (
			<div>
				<p>{this.state.reportDate}</p>
				<p>Total Revenue: {this.state.totalRevenue}</p>
				<p>Cost of Revenue: {this.state.costOfRevenue}</p>
				<p>Gross Profit: {this.state.grossProfit}</p>
				<p>Operating Expense: {this.state.operatingExpense}</p>
				<p>Research and Development: {this.state.researchAndDevelopment}</p>
				<p>Operating Income: {this.state.operatingIncome}</p>
				<p>Net Income: {this.state.netIncome}</p>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCompanyFinancial})(Financial);
