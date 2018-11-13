import React, { Component } from 'react';
import { getCompanyFinancial, getCompanyFinancialAnnual, getCurrentPrice, getCompanyStat } from '../actions/portfolioActions';
import FinancialField from './FinancialField';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { Tab } from 'semantic-ui-react'
import { Row, Col } from 'antd';

class Financial extends Component{
	constructor(props) {
	    super(props);
	    this.state ={
	    	mostRecentQuarter: '',
	    	mostRecentQuarter2: '',
	    	mostRecentQuarter3: '',
	    	mostRecentQuarter4: '',
	    	mostRecentYear:'',
	    	mostRecentYear2:'',
	    	mostRecentYear3:'',
	    	mostRecentYear4:'',
	    	priceData: '',
	    	statData: ''
	    };

	    this.getFinancial = this.getFinancial.bind(this);
	}

	componentDidMount(){
		this.getFinancial(this.props.ticker);
		this.getPriceData(this.props.ticker);
	}

	componentWillReceiveProps(newProps) {
		this.getFinancial(newProps.ticker);
		this.getPriceData(newProps.ticker);
	}

	getFinancial(ticker) {
		this.props.getCompanyFinancial(ticker).then((res) =>{
			if (res.payload.financials){
				this.setState({
		    		mostRecentQuarter: res.payload.financials[0],
		    		mostRecentQuarter2: res.payload.financials[1],
		    		mostRecentQuarter3: res.payload.financials[2],
		    		mostRecentQuarter4: res.payload.financials[3],
		    	});
			} else {
				this.setState({
		    		mostRecentQuarter: '',
		    		mostRecentQuarter2: '',
		    		mostRecentQuarter3: '',
		    		mostRecentQuarter4: ''
		    	});
			}
		}).catch(error => {
			this.setState({
		    	mostRecentQuarter: '',
		    	mostRecentQuarter2: '',
		    	mostRecentQuarter3: '',
		    	mostRecentQuarter4: ''
	    	});
	    	console.log(error);
	   	});

	   	this.props.getCompanyFinancialAnnual(ticker).then((res) =>{
			if (res.payload.financials){
				this.setState({
		    		mostRecentYear: res.payload.financials[0],
		    		mostRecentYear2: res.payload.financials[1],
		    		mostRecentYear3: res.payload.financials[2],
		    		mostRecentYear4: res.payload.financials[3],
		    	});
			} else {
				this.setState({
		    		mostRecentYear: '',
		    		mostRecentYear2: '',
		    		mostRecentYear3: '',
		    		mostRecentYear4: ''
		    	});
			}
		}).catch(error => {
			this.setState({
		    	mostRecentYear: '',
		    	mostRecentYear2: '',
		    	mostRecentYear3: '',
		    	mostRecentYear4: ''
	    	});
	    	console.log(error);
	   	});
	}

	getPriceData(ticker){
		//Get current price for ticker 
		this.props.getCurrentPrice(ticker).then((res) => {
			this.setState({
				priceData: res.payload,
				changePercent: res.payload.changePercent * 100
	    	});	
		}).catch(error => {
	    	this.setState({
				priceData: ''
	    	});
	   	});

	   	//Get company stat 
		this.props.getCompanyStat(ticker).then((res) => {
			this.setState({
				statData: res.payload
	    	});
		}).catch(error => {
	    	this.setState({
				statData: ''
	    	});
	   	});
	}


	render() {
		const panes = [
		  { menuItem: 'Quater', render: () => <Tab.Pane>
			  	<Table hover responsive style={{marginTop:25+'px'}}>
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
		  </Tab.Pane> },
		  { menuItem: 'Annual', render: () => <Tab.Pane>
		  		<Table hover responsive style={{marginTop:25+'px'}}>
					<tbody>
						<tr>
							<th>Report Date</th>
							<th><FinancialField data = {this.state.mostRecentYear.reportDate} /></th>
							<th><FinancialField data = {this.state.mostRecentYear2.reportDate} /></th>
							<th><FinancialField data = {this.state.mostRecentYear3.reportDate} /></th>
							<th><FinancialField data = {this.state.mostRecentYear4.reportDate} /></th>
						</tr>
						<tr>
							<th>Total Revenue</th>
						  	<td><FinancialField data = {this.state.mostRecentYear.totalRevenue} /></td>
						  	<td><FinancialField data = {this.state.mostRecentYear2.totalRevenue} /></td>
						  	<td><FinancialField data = {this.state.mostRecentYear3.totalRevenue} /></td>
						  	<td><FinancialField data = {this.state.mostRecentYear4.totalRevenue} /></td>
						</tr>
						<tr>
							<th>Cost of Revenue</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.costOfRevenue} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.costOfRevenue} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.costOfRevenue} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.costOfRevenue} /></td>
						</tr>
						<tr>
							<th>Gross Profit</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.grossProfit} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.grossProfit} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.grossProfit} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.grossProfit} /></td>
						</tr>
						<tr>
							<th>Operating Expense</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.operatingExpense} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.operatingExpense} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.operatingExpense} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.operatingExpense} /></td>
						</tr>
						<tr>
							<th>Research Development</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.researchAndDevelopment} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.researchAndDevelopment} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.researchAndDevelopment} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.researchAndDevelopment} /></td>
						</tr>
						<tr>
							<th>Operating Income</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.operatingIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.operatingIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.operatingIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.operatingIncome} /></td>
						</tr>
						<tr>
							<th>Net Income</th>
				  			<td><FinancialField data = {this.state.mostRecentYear.netIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear2.netIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear3.netIncome} /></td>
				  			<td><FinancialField data = {this.state.mostRecentYear4.netIncome} /></td>
						</tr>
					</tbody>
				</Table>
		  </Tab.Pane> },
		]

		return (
			<div>
			{this.state.priceData && this.state.statData ? (
				<Row style={{marginLeft:10+'px'}}>
					<Col span={7}>
						<p>Open {this.state.priceData.open}</p>
						<p>High {this.state.priceData.high}</p>
						<p>Low {this.state.priceData.low}</p>
						<p>Market Cap {this.state.priceData.marketCap.toLocaleString(undefined)}</p>
						<p>PE Ratio {this.state.priceData.peRatio}</p>
					</Col>
					<Col span={7}>
						<p>52 wk High {this.state.priceData.week52High}</p>
						<p>52 wk Low {this.state.priceData.week52Low}</p>
						<p>EPS {this.state.statData.ttmEPS.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
						<p>Dividend Rate {this.state.statData.dividendRate.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
						<p>Dividend Yield {this.state.statData.dividendYield.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
					</Col>
				</Row>
			) : (
				<p> - </p>
			)}
			<Tab panes={panes} style={{marginTop:30+'px'}}/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCompanyFinancial, getCompanyFinancialAnnual, getCurrentPrice, getCompanyStat})(Financial);
