import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { registerAction } from '../actions/authActions';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { Icon } from 'antd';
import axios from 'axios';

class Register extends React.Component {
  	constructor(props) {
    	super(props);
    	this.state = {
	      	email: '',
	      	password: '',
	      	password2: '',
	      	successAlert: false,
	      	passwordAlert: false,
	      	passLengthAlert: false,
	      	emailAlert: false,
	    };

    	this.handleAddUser = this.handleAddUser.bind(this);
	}


	handleAddUser = (e) => {
		e.preventDefault();

		this.setState({
			successAlert: false,
			passwordAlert: false,
			passLengthAlert: false,
			emailAlert: false
		});
		//Check both passwords match
		if(e.target.elements.confirmPassword.value !== e.target.elements.userPassword.value){
			this.setState({
	        	passwordAlert: true
	        });
		}

		//Check if password is longer than 6 characters
		if (e.target.elements.confirmPassword.value.trim().length < 6){
			this.setState({
	        	passLengthAlert: true
	        });
		}

		const newUser = {
	    	email: e.target.elements.email.value,
	    	password: e.target.elements.userPassword.value
	    };

		//Check if email is in database/registered
		axios.post('/api/users/email', newUser).then((res) => {
			if(res.data){
				this.setState({
		        	emailAlert: true
	        	});
			} 
		}).catch(err => {
	    	this.setState({
		        emailAlert: false
	        });
	    });

	    if(!this.state.passwordAlert && !this.state.passLengthAlert && !this.state.emailAlert) {
	    	axios.post('/api/users', newUser).then(res =>{
		        localStorage.setItem('jwtToken', res.headers.xauth);
		        this.setState({
		        	passwordAlert: false,
		        	passLengthAlert: false,
		        	emailAlert: false,
		        	successAlert: true
		        });
		    	setTimeout(() => window.location.href = '/portfolio', 3000);
		    }).catch(err => {
		    	console.log(err);
		    });
	    }
	}

	render() {
		return(
			<div className="container">
				<Alert style={{marginTop: 25+'px'}} color="success" isOpen={this.state.successAlert}>
			        <Icon type="loading" theme="outlined" /> Registration Successful. Redirecting to Portfolio... 
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.passwordAlert}>
			    	Passwords do not match.
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.passLengthAlert}>
			    	Password needs to be longer than 6 characters.
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.emailAlert}>
			    	This email has already been registered
			    </Alert>

      			<Form onSubmit={this.handleAddUser}>
      				<br />
        			<FormGroup>
          				<Label for="email">Email</Label>
			        	<Input type="email" name="email" id="email" placeholder="Email" />
			        </FormGroup>
        			<FormGroup>
        				<Label for="password">Password - minimum 6 characters</Label>
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