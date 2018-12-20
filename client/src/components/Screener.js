import React from 'react';
import { HTMLSelect, Button, ButtonGroup, Intent } from "@blueprintjs/core";
import { Row, Col, Table } from 'antd';
import axios from 'axios';

//Class for rendering each individual tickers on portfolio
class Screener extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterResult:''
        }
    }

    setFilterState = (e) => {
        this.setState({ [e.target.id]: e.target.value }, () => {
            //console.log(this.state);
        });
    }

    applyFiler = () => {
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
            key: 'symbol'
        }, {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName'
        }, {
            title: 'Market Cap',
            dataIndex: 'marketcap',
            key: 'marketcap'
        },{
            title: 'Dividend Yield',
            dataIndex: 'dividendYield',
            key: 'dividendYield'
        }];

        return (
            <div>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={3}>
                        <label>Market Cap</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
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

                    <Col span={3}>
                        <label>Dividend Yield</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
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

                    <Col span={3}>
                        <label>EPS</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            id='ttmEPS'
                            value={this.state.ttmEPS}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={3}>
                        <label>EPS Surprise Percent</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
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
                    <Col span={3}>
                        <label>PE Ratio</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect>
                            <option value=''> Any </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={3}>
                        <label>Beta</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
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

                    <Col span={3}>
                        <label>50 Days SMA</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            id='day50MovingAvg'
                            value={this.state.beta}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value=''> below price</option>
                            <option value=''> 1% below price </option>
                            <option value=''> 5% below price </option>
                            <option value=''> 10% below price </option>
                            <option value=''> above price</option>
                            <option value=''> 1% above price </option>
                            <option value=''> 5% above price </option>
                            <option value=''> 10% above price </option>
                            <option value=''> below SMA200</option>
                            <option value=''> 1% below SMA200 </option>
                            <option value=''> 5% below SMA200 </option>
                            <option value=''> 10% below SMA200 </option>
                            <option value=''> above SMA200</option>
                            <option value=''> 1% above SMA200 </option>
                            <option value=''> 5% above SMA200 </option>
                            <option value=''> 10% above SMA200 </option>
                        </HTMLSelect>
                    </Col>
                    <Col span={3}>
                        <label>200 Days SMA</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            id='day200MovingAvg'
                            value={this.state.beta}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value=''> below price</option>
                            <option value=''> 1% below price </option>
                            <option value=''> 5% below price </option>
                            <option value=''> 10% below price </option>
                            <option value=''> above price</option>
                            <option value=''> 1% above price </option>
                            <option value=''> 5% above price </option>
                            <option value=''> 10% above price </option>
                            <option value=''> below SMA50</option>
                            <option value=''> 1% below SMA50 </option>
                            <option value=''> 5% below SMA50 </option>
                            <option value=''> 10% below SMA50 </option>
                            <option value=''> above SMA50</option>
                            <option value=''> 1% above SMA50 </option>
                            <option value=''> 5% above SMA50 </option>
                            <option value=''> 10% above SMA50 </option>
                        </HTMLSelect>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '10px' }}>
                    <Col span={3}>
                        <label>52wks High</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            id='week52high'
                            value={this.state.beta}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value=''> 5% above price </option>
                            <option value=''> 10% above price </option>
                            <option value=''> 15% above price </option>
                            <option value=''> 20% above price </option>
                            <option value=''> 25% above price </option>
                        </HTMLSelect>
                    </Col>

                    <Col span={3}>
                        <label>52wks Low</label>
                    </Col>
                    <Col span={3}>
                        <HTMLSelect
                            id='week52low'
                            value={this.state.beta}
                            onChange={this.setFilterState}
                        >
                            <option value=''> Any </option>
                            <option value=''> 5% below price </option>
                            <option value=''> 10% below price </option>
                            <option value=''> 15% below price </option>
                            <option value=''> 20% below price </option>
                            <option value=''> 25% below price </option>
                        </HTMLSelect>
                    </Col>
                </Row>
                <Button 
                    intent = {Intent.PRIMARY}    
                    onClick={this.applyFiler}
                >Filter</Button>

                {
                    this.state.filterResult !== '' &&
                        <Table 
                            style={{marginTop:'10px'}}
                            dataSource={this.state.filterResult} 
                            columns={columns}
                        >
                        </Table>
                }
            </div>
        );
    }
}

export default Screener;