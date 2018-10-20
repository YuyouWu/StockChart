import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { loginAction } from '../actions/authActions';
import { connect } from 'react-redux';

class Login extends React.Component {
  	constructor() {
    	super();
    	this.handleLogin = this.handleLogin.bind(this);
	}


	handleLogin = (e) => {
		e.preventDefault();

		const user = {
	    	email: e.target.elements.email.value,
	    	password: e.target.elements.userPassword.value
	    };
	    this.props.loginAction(user).then((res) => {
	    	//TODO
	    	this.props.history.push('/portfolio');
		}).catch(function(err){
			console.log(err);
		});
	}

	render() {
		return(
			<div className="container">
      			<Form onSubmit={this.handleLogin} href="/portfolio">
      				<br />
        			<FormGroup>
          				<Label for="email">Email</Label>
			        	<Input type="email" name="email" id="email" placeholder="Email" />
			        </FormGroup>
        			<FormGroup>
        				<Label for="password">Password</Label>
          				<Input type="password" name="userPassword" id="userPassword" placeholder="Password" />
        			</FormGroup>
	                <Button>
	                	Login
	                </Button>
		        </Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps,{loginAction})(Login);