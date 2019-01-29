import React from 'react';
import { Jumbotron, Card, CardTitle, CardText, CardImg, Row, Col, Button } from 'reactstrap';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import data from './Asset/data.png';
import chart from './Asset/chart.png';
import screener from './Asset/screener.png';
import jumbotronImg from './Asset/jumbotronImg.png';
const { Footer } = Layout;
//Class for rendering each individual tickers on portfolio
class LandingPage extends React.Component {
  render() {
    return (
    	<div className="container">
		    <Jumbotron style={{marginTop: 25+'px', backgroundImage:'url('+ jumbotronImg +')', backgroundRepeat:'no-repeat', backgroundSize:'cover', height:'500px', maxWidth:'100%'}}>
		        <h2 className="display-4">Manage Your Investment with Plusfolio</h2>
		        <p className="lead">
		        	Plusfolio is an online stock portfolio that provides easy access to market information, portfolio optimization, and techical analysis. 
		        </p>
		        <p className="lead">
					<Button size="lg" color="primary" tag={Link} href="/register" to="/register">Start for free</Button>
		        </p>
		    </Jumbotron>
		    <Row>
		    	<Col sm="4">
				    <Card body style={{height: '300px'}}>
						<CardTitle>Real Time Data</CardTitle>
						<CardImg top width="100%" src={data} alt="data" />
				        <CardText>Real time market data, stock quotes, and news provided by IEX</CardText>
				    </Card>
				</Col>
			    <Col sm="4">
				    <Card body style={{height: '300px'}}>
						<CardTitle>Charting</CardTitle>
						<CardImg top width="100%" src={chart} alt="data" />
				        <CardText>High performance chart with drawing tools and technical indicators</CardText>
				    </Card>
			    </Col>
			    <Col sm="4">
				    <Card body style={{height: '300px'}}>
						<CardTitle>Screener</CardTitle>
						<CardImg top width="100%" src={screener} alt="data" />
				        <CardText>Pick the right stock for your portfolio with our stock screener</CardText>
				    </Card>
			    </Col>
		    </Row>
			<Footer style={{ textAlign: 'center', marginTop: '20px' }}>
				<p style={{ fontSize: '12px' }}>Plusfolio ©2019</p>
				<p style={{ fontSize: '12px' }}>Data provided for free by <a href="https://iextrading.com/developer">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.</p>
			</Footer>
		</div>
    );
  }
}

export default LandingPage;