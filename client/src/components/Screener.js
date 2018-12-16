import React from 'react';
import { HTMLSelect, Button, ButtonGroup } from "@blueprintjs/core";
import { Row, Col } from 'antd';

//Class for rendering each individual tickers on portfolio
class Screener extends React.Component {
  	render() {
	    return (
            <div>
                <Row style={{marginBottom: '10px'}}>
                    <Col span={3}>
                        <label>Market Cap</label>
                    </Col>
                    <Col span={3}>  
                        <HTMLSelect>
                            <option value = ''> Select... </option>
                        </HTMLSelect>
                    </Col>
                    <Col span={3}> 
                        <label>Average Total Volume</label>
                    </Col>
                    <Col span={3}> 
                        <HTMLSelect>
                            <option value = ''> Select... </option>
                        </HTMLSelect>
                    </Col>
                    <Col span={3}> 
                        <label>Dividend Rate</label>
                    </Col>
                    <Col span={3}> 
                        <HTMLSelect>
                            <option value = ''> Select... </option>
                        </HTMLSelect>
                    </Col>
                    <Col span={3}> 
                        <label>Dividend Yield</label>
                    </Col>
                    <Col span={3}>    
                        <HTMLSelect>
                            <option value = ''> Select... </option>
                        </HTMLSelect>
                    </Col>
                </Row>

                <Row style={{marginBottom: '10px'}}>
                    <Col span={3}>
                    <label>EPS</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                    <Col span={3}>
                    <label>Revenue Per Share</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                    <Col span={3}>
                    <label>PE Ratio</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>

                    {/* Technical */}
                    <Col span={3}>
                    <label>Beta</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                </Row>

                <Row style={{marginBottom: '10px'}}>
                    <Col span={3}>
                    <label>RSI</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                    <Col span={3}>
                    <label>50 Days MA</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                    <Col span={3}>
                    <label>200 Days MA</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                    <Col span={3}>
                    <label>52wks High</label>
                    </Col>
                    <Col span={3}>
                    <HTMLSelect>
                        <option value = ''> Select... </option>
                    </HTMLSelect>
                    </Col>
                </Row>
                
                <Col span={3}>
                <label>52wks Low</label>
                </Col>
                <Col span={3}>
                <HTMLSelect>
                    <option value = ''> Select... </option>
                </HTMLSelect>
                </Col>
            </div>
        );
  	}
}

export default Screener;