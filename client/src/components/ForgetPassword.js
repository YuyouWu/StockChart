import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import axios from 'axios';

class ForgetPassword extends React.Component {
  	constructor(props) {
    	super(props);
    	this.state = {
    		successAlert: false,
            failedAlert: false
        }
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const user = {
	    	email: e.target.elements.email.value,
	    };

	    axios.post('/api/updatePasswordEmail', user).then(res =>{
	    	this.setState({
	        	successAlert: true,
	        	failedAlert: false
	        });
	    }).catch(err => {
			this.setState({
				successAlert: false,
	        	failedAlert: true
	        });
	    });
	}

	render() {
		return(
			<div className="container">

				<Alert style={{marginTop: 25+'px'}} color="success" isOpen={this.state.successAlert}>
			        An email has been sent with instructions to reset your password.
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.failedAlert}>
			        Email not found in database
			    </Alert>

      			<Form onSubmit={this.handleSubmit} href="/portfolio">
      				<br />
        			<FormGroup>
          				<Label for="email">Email</Label>
			        	<Input type="email" name="email" id="email" placeholder="Email" />
			        </FormGroup>
	                <Button>
	                	Submit
	                </Button>
		        </Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps,{})(ForgetPassword);