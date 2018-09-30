import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { registerAction } from '../actions/authActions';
import { connect } from 'react-redux';

class Register extends React.Component {
  	constructor(props) {
    	super(props);
    	this.state = {
	      	email: '',
	      	password: '',
	      	password2: ''
	    };

    	this.handleAddUser = this.handleAddUser.bind(this);
	}


	handleAddUser = (e) => {
		e.preventDefault();
		if(e.target.elements.confirmPassword.value !== e.target.elements.userPassword.value){
			console.log("Passwords do not match");
			return;
		}

		const newUser = {
	    	email: e.target.elements.email.value,
	    	password: e.target.elements.userPassword.value
	    };

		this.props.registerAction(newUser);
	}

	render() {
		return(
			<div className="container">
      			<Form onSubmit={this.handleAddUser}>
      				<br />
        			<FormGroup>
          				<Label for="email">Email</Label>
			        	<Input type="email" name="email" id="email" placeholder="Email" />
			        </FormGroup>
        			<FormGroup>
        				<Label for="password">Password</Label>
          				<Input type="password" name="userPassword" id="userPassword" placeholder="Password" />
        			</FormGroup>
        			<FormGroup>
        				<Label for="confirmPassword">Confirm Password</Label>
          				<Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
        			</FormGroup>
	                <Button>Submit</Button>
		        </Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps,{registerAction})(Register);