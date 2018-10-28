import React from 'react';
import { Jumbotron, Card, CardTitle, CardText, Row, Col } from 'reactstrap';

//Class for rendering each individual tickers on portfolio
class LandingPage extends React.Component {
  render() {
    return (
    	<div>
		    <Jumbotron style={{marginTop: 25+'px'}}>
		        <h1 className="display-4">Welcome to Prophest</h1>
		        <p className="lead">
		        	Prophest is your one stop shop for dank memes and stock market information. 
		        </p>
		        <p className="lead">
		        	Register now to find out more.
		        </p>
		        <p className="lead">
		        	- CSO (Chief Salty Officer): Phuc Nguyen
		        </p>
		    </Jumbotron>
		    <Row>
		    	<Col sm="4">
				    <Card body>
				        <CardTitle>It's Clean</CardTitle>
				        <CardText>Unlike our competitors. Provest does not display ads for revenue (for now).</CardText>
				    </Card>
				</Col>
			    <Col sm="4">
				    <Card body>
				        <CardTitle>It's Fast</CardTitle>
				        <CardText>Gotta go fast.</CardText>
				    </Card>
			    </Col>
			    <Col sm="4">
				    <Card body>
				        <CardTitle>It's Accurate</CardTitle>
				        <CardText>I think so.</CardText>
				    </Card>
			    </Col>
		    </Row>
		</div>
    );
  }
}

export default LandingPage;