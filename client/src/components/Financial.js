import React, { Component } from 'react';
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
	}

	componentDidMount(){
		//Get Company Financial 
	  	let reqString = 'https://api.iextrading.com/1.0/stock/' + this.props.ticker + '/financials';
	  	axios.get(reqString)
	    .then(response => {
	    	this.setState({
	    		reportDate: response.data.financials[0].reportDate,
	    		totalRevenue: response.data.financials[0].totalRevenue,
	    		costOfRevenue: response.data.financials[0].costOfRevenue,
	    		grossProfit: response.data.financials[0].grossProfit,
	    		operatingExpense: response.data.financials[0].operatingExpense,
	    		researchAndDevelopment: response.data.financials[0].researchAndDevelopment,
	    		operatingIncome: response.data.financials[0].operatingIncome,
	    		netIncome: response.data.financials[0].netIncome
	    	});

	    	console.log("1st: "+this.state.reportDate);
	  	}).catch(error => {
	    	console.log(error);
	    });
	}

	componentWillReceiveProps(newProps) {
		//Get Company Financial 
	  	let reqString = 'https://api.iextrading.com/1.0/stock/' + newProps.ticker + '/financials';
	  	axios.get(reqString)
	    .then(response => {
	    	this.setState({
	    		reportDate: response.data.financials[0].reportDate,
	    		totalRevenue: response.data.financials[0].totalRevenue,
	    		costOfRevenue: response.data.financials[0].costOfRevenue,
	    		grossProfit: response.data.financials[0].grossProfit,
	    		operatingExpense: response.data.financials[0].operatingExpense,
	    		researchAndDevelopment: response.data.financials[0].researchAndDevelopment,
	    		operatingIncome: response.data.financials[0].operatingIncome,
	    		netIncome: response.data.financials[0].netIncome
	    	});

	    	console.log("2nd: "+this.state.reportDate);
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

export default Financial;