import React from 'react';
import { HTMLSelect, Button, ButtonGroup, Intent } from "@blueprintjs/core";
import { Row, Col, Table, Skeleton } from 'antd';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class Screener extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marketcap:'',
            dividendYield:'',
            ttmEPS:'',
            EPSSurprisePercent:'',
            beta:'',
            day50MovingAvg:'',
            day200MovingAvg:'',
            week52high:'',
            week52low:'',
            peRatio:'',
            filterResult:''
        }
    }

    setFilterState = (e) => {
        this.setState({ [e.target.id]: e.target.value }, () => {
            //console.log(this.state);
        });
    }

    applyFiler = () => {
        this.setState({
            filterResult: 'loading'
        });
        axios.post('/api/filterScreener', this.state).then(res => {
            this.setState({
                filterResult: res.data
            }, () => {
                console.log(this.state.filterResult);
            });
        });
    }

    render() {
        const columns = [{
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            sorter: (a, b) => a.symbol < b.symbol,
            width: 150
        }, {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
            sorter: (a, b) => a.symbol < b.symbol,
            width: 200
        }, {
            title: 'Market Cap',
            dataIndex: 'marketcap',
            key: 'marketcap',
            sorter: (a, b) => a.marketcap - b.marketcap,
            render: text => <p> {text.toLocaleString(undefined)}</p>
        }, { 
            title: 'PE Ratio',
            dataIndex: 'peRatio',
            key: 'peRatio',
            sorter: (a, b) => a.peRatio - b.peRatio
        }, { 
            title: '52 wks High',
            dataIndex: 'week52high',
            key: 'week52high',
            sorter: (a, b) => a.week52high - b.week52high
        }, { 
            title: '52 wks Low',
            dataIndex: 'week52low',
            key: 'week52low',
            sorter: (a, b) => a.week52low - b.week52low
        }, {
            title: 'Dividend Yield',
            dataIndex: 'dividendYield',
            key: 'dividendYield',
            sorter: (a, b) => a.dividendYield - b.dividendYield,
            render: text => <p> {text.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        }];

        return (
            <div style={{width: '1500px'}}>
                <Row style={{ marginBottom: '10px'}}>
                    <Col span={2}>
                        <label>Market Cap</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='marketcap'
                            value={this.state.marketcap}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='nanocap'> Nanocap (less than $50m) </option>
                            <option value='microcap'> Microcaps ($50m to $300m)</option>
                            <option value='smallcap'> Small-caps ($300m to $2b)</option>
                            <option value='midcap'> Mid-caps ($2b to $10b)</option>
                            <option value='largecap'> Large-caps ($10b to $300b)</option>
                            <option value='megacap'> Mega-caps (over $300b)</option>
                        </HTMLSelect>
                    </Col>

                    <Col span={2}>
                        <label>Sector</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='sector'
                            value={this.state.sector}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='Utilities'> Utilities </option>
                            <option value='Basic Materials'> Materials </option>
                            <option value='Healthcare'> Health Care </option>
                            <option value='Energy'> Energy </option>
                            <option value='Consumer Defensive'> Consumer Staples </option>
                            <option value='Industrials'> Industrials </option>
                            <option value='Financial Services'> Financials </option>
                            <option value='Consumer Cyclical'> Consumer Discretionary </option>
                            <option value='Real Estate'> Real Estate </option>
                            <option value='Technology'> Technology </option>
                            <option value='Communication Services'> Communication Services </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={2}>
                        <label>Dividend Yield</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='dividendYield'
                            value={this.state.dividendRate}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='none'> none </option>
                            <option value='positive'> positive </option>
                            <option value='1'> 1% to 3% </option>
                            <option value='3'> 3% to 5%</option>
                            <option value='5'> 5% to 7%</option>
                            <option value='7'> 7% to 9%</option>
                            <option value='9'> over 9% </option>
                        </HTMLSelect>
                    </Col>

                    {/* <Col span={2}>
                        <label>EPS</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='ttmEPS'
                            value={this.state.ttmEPS}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                        </HTMLSelect>
                    </Col> */}

                    <Col span={2}>
                        <label>EPS Surprise %</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='EPSSurprisePercent'
                            value={this.state.EPSSurprisePercent}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='1'> 1% to 3% </option>
                            <option value='3'> 3% to 5% </option>
                            <option value='5'> over 5% </option>
                        </HTMLSelect>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={2}>
                        <label>PE Ratio</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='peRatio'
                            value={this.state.peRatio}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='profitable'> Profitable (&gt;0)</option>
                            <option value='low'> Low (&lt;15) </option>
                            <option value='high'> High (&gt;50) </option>
                            <option value='<5'> under 5 </option>
                            <option value='<10'> under 10 </option>
                            <option value='<20'> under 20 </option>
                            <option value='<30'> under 30 </option>
                            <option value='>5'> over 5 </option>
                            <option value='>10'> over 10 </option>
                            <option value='>20'> over 20 </option>
                            <option value='>30'> over 30 </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={2}>
                        <label>Beta</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='beta'
                            value={this.state.beta}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='negative'> negative </option>
                            <option value='0-0.5'> 0 to 0.5 </option>
                            <option value='0.5-1'> 0.5 to 1 </option>
                            <option value='1-1.5'> 1 to 1.5 </option>
                            <option value='1.5-2'> 1.5 to 2 </option>
                            <option value='2-3'> 2 to 3 </option>
                            <option value='3-5'> 3 to 5 </option>
                            <option value='5'> over 5 </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={2}>
                        <label>50 Days SMA</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='day50MovingAvg'
                            value={this.state.day50MovingAvg}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='belowPrice'> below price</option>
                            <option value='1%belowPrice'> 1% below price </option>
                            <option value='5%belowPrice'> 5% below price </option>
                            <option value='10%belowPrice'> 10% below price </option>
                            <option value='abovePrice'> above price</option>
                            <option value='1%abovePrice'> 1% above price </option>
                            <option value='5%abovePrice'> 5% above price </option>
                            <option value='10%abovePrice'> 10% above price </option>
                            <option value='belowSMA200'> below SMA200</option>
                            <option value='1%belowSMA200'> 1% below SMA200 </option>
                            <option value='5%belowSMA200'> 5% below SMA200 </option>
                            <option value='10%belowSMA200'> 10% below SMA200 </option>
                            <option value='aboveSMA200'> above SMA200</option>
                            <option value='1%aboveSMA200'> 1% above SMA200 </option>
                            <option value='5%aboveSMA200'> 5% above SMA200 </option>
                            <option value='10%aboveSMA200'> 10% above SMA200 </option>
                        </HTMLSelect>
                    </Col>
                    <Col span={2}>
                        <label>200 Days SMA</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='day200MovingAvg'
                            value={this.state.day200MovingAvg}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='belowPrice'> below price</option>
                            <option value='1%belowPrice'> 1% below price </option>
                            <option value='5%belowPrice'> 5% below price </option>
                            <option value='10%belowPrice'> 10% below price </option>
                            <option value='abovePrice'> above price</option>
                            <option value='1%abovePrice'> 1% above price </option>
                            <option value='5%abovePrice'> 5% above price </option>
                            <option value='10%abovePrice'> 10% above price </option>
                            <option value='belowSMA50'> below SMA50</option>
                            <option value='1%belowSMA50'> 1% below SMA50 </option>
                            <option value='5%belowSMA50'> 5% below SMA50 </option>
                            <option value='10%belowSMA50'> 10% below SMA50 </option>
                            <option value='aboveSMA50'> above SMA50</option>
                            <option value='1%aboveSMA50'> 1% above SMA50 </option>
                            <option value='5%aboveSMA50'> 5% above SMA50 </option>
                            <option value='10%aboveSMA50'> 10% above SMA50 </option>
                        </HTMLSelect>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '10px' }}>
                    <Col span={2}>
                        <label>52wks High</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='week52high'
                            value={this.state.week52high}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='1%aboveprice'> 1% above price </option>
                            <option value='5%aboveprice'> 5% above price </option>
                            <option value='10%aboveprice'> 10% above price </option>
                            <option value='15%aboveprice'> 15% above price </option>
                            <option value='20%aboveprice'> 20% above price </option>
                            <option value='25%aboveprice'> 25% above price </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={2}>
                        <label>52wks Low</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            style={{width:'100px'}}
                            id='week52low'
                            value={this.state.week52low}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value='1%belowprice'> 1% below price </option>
                            <option value='5%belowprice'> 5% below price </option>
                            <option value='10%belowprice'> 10% below price </option>
                            <option value='15%belowprice'> 15% below price </option>
                            <option value='20%belowprice'> 20% below price </option>
                            <option value='25%belowprice'> 25% below price </option>
                        </HTMLSelect>
                    </Col>
                </Row>
                <Button 
                    intent = {Intent.PRIMARY}    
                    onClick={this.applyFiler}
                >Filter</Button>
                {
                    this.state.filterResult !== '' ? (
                        this.state.filterResult !== 'loading' ? (
                            <div style={{marginTop:'10px', width:'1200px'}}>
                                <Table 
                                    dataSource={this.state.filterResult} 
                                    columns={columns}
                                >
                                </Table>
                            </div>
                        ):(
                            <div style={{marginTop:'30px', width:'1200px'}}>
                                <Skeleton 
                                    active
                                    title = {false}
                                    paragraph={{ rows: 10 }}
                                />
                            </div>
                        )
                    ):(
                        <div></div> 
                    ) 
                }
            </div>
        );
    }
}

export default Screener;