import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Register extends React.Component {
  	constructor() {
    	super();
    	this.state = {
	      	email: '',
	      	password: '',
	      	password2: '',
	      	errors: {}
    	};
	}

	render() {
		return(
			<div className="container">
      			<Form>
      				<br />
        			<FormGroup>
          				<Label for="email">Email</Label>
			        	<Input type="email" name="email" id="email" placeholder="Email" />
			        </FormGroup>
        			<FormGroup>
        				<Label for="password">Password</Label>
          				<Input type="password" name="password" id="password" placeholder="Password" />
        			</FormGroup>
        			<FormGroup>
        				<Label for="confirmPassword">Confirm Password</Label>
          				<Input type="password" name="password" id="confirmPassword" placeholder="Confirm Password" />
        			</FormGroup>
	                <Button>Submit</Button>
		        </Form>
			</div>
		);
	}
}

export default Register;