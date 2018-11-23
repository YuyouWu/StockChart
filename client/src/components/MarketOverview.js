import React from 'react';
import { getTickers, getCurrentPrice } from '../actions/portfolioActions';
import { connect } from 'react-redux';
import { Divider } from '@blueprintjs/core';
import { Card } from 'antd';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class MarketOvewview extends React.Component {
  	constructor(){
 		super();
 		this.state = {
			sectorData: ['']
		 }
 	}

  	componentDidMount(){
		//Get market sector performance
		axios.get('https://api.iextrading.com/1.0/stock/market/sector-performance').then(res =>{
			this.setState({
				sectorData: res.data
			});
		});
 	}


  	render() {
    	return (
			<div>
				<Divider style={{marginTop:'-21px'}}/>
				{this.state.sectorData ? (
					<div>
						<Card
							hoverable
							title='Daily Sector Performance'
							style={{marginTop:'10px', marginBottom:'10px', width:'1000px'}}
						>
						{this.state.sectorData.map((sector) =>{
							return(
								<Card.Grid  style={{width: '25%', textAlign:'center'}}>
									<b>{sector.name}</b>
									{sector.performance < 0 ? (
									<p style={{color:'red'}}>{(sector.performance*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
									): (
									<p style={{color:'green'}}>{(sector.performance*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%</p>
									)}
								</Card.Grid>
								
							)
						})}
						</Card>
                        <p>Sector performance is based on each sector ETF*</p>
					</div>
				):(
					<p>Loading</p>
				)}
			</div>
    	);
  	}
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps,{getTickers, getCurrentPrice})(MarketOvewview);
