import React, { Component } from 'react';
import { getCompanyFinancial } from '../actions/portfolioActions';
import FinancialField from './FinancialField';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

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
			this.setState({
	    		mostRecentQuarter: res.payload.financials[0],
	    		mostRecentQuarter2: res.payload.financials[1],
	    		mostRecentQuarter3: res.payload.financials[2],
	    		//mostRecentQuarter4: res.payload.financials[3]
	    	});
		}).catch(error => {
	    	console.log(error);
	   	});
	}

	render() {
		return (
			<div>
			<Row gutter={16}>
			  <Col span={6}>
			  	<p>Report Date</p>
			  	<p>Total Revenue</p>
			  	<p>Cost of Revenue</p>
			  	<p>Gross Profit</p>
			  	<p>Operating Expense</p>
			  	<p>Research Development</p>
			  	<p>Operating Income</p>
			  	<p>Net Income</p>
			  </Col>
			  <Col span={6}>
			  	<FinancialField data = {this.state.mostRecentQuarter.reportDate} />
			  	<FinancialField data = {this.state.mostRecentQuarter.totalRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter.costOfRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter.grossProfit} />
			  	<FinancialField data = {this.state.mostRecentQuarter.operatingExpense} />
			  	<FinancialField data = {this.state.mostRecentQuarter.researchAndDevelopment} />
			  	<FinancialField data = {this.state.mostRecentQuarter.operatingIncome} />
			  	<FinancialField data = {this.state.mostRecentQuarter.netIncome} />
			  </Col>
			  <Col span={6}>
			  	<FinancialField data = {this.state.mostRecentQuarter2.reportDate} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.totalRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.costOfRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.grossProfit} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.operatingExpense} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.researchAndDevelopment} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.operatingIncome} />
			  	<FinancialField data = {this.state.mostRecentQuarter2.netIncome} />
			  </Col>
			  <Col span={6}>
			  	<FinancialField data = {this.state.mostRecentQuarter3.reportDate} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.totalRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.costOfRevenue} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.grossProfit} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.operatingExpense} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.researchAndDevelopment} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.operatingIncome} />
			  	<FinancialField data = {this.state.mostRecentQuarter3.netIncome} />
			  </Col>
			</Row>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  tickers: state.tickers
});
export default connect(mapStateToProps,{getCompanyFinancial})(Financial);
