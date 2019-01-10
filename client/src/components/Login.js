import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { loginAction, setCurrentUser } from '../actions/authActions';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { Icon } from 'antd';
import axios from 'axios';

class Login extends React.Component {
  	constructor(props) {
    	super(props);
    	this.state = {
    		successAlert: false,
    		failedAlert: false,
    	}
    	this.handleLogin = this.handleLogin.bind(this);

    	this.props.setCurrentUser().then((res) => {
			if(res.payload._id){
				window.location.href = '/portfolio'
			}
		});
	}

	handleLogin = (e) => {
		e.preventDefault();

		const user = {
	    	email: e.target.elements.email.value,
	    	password: e.target.elements.userPassword.value
	    };

	    // this.props.loginAction(user).then((res) => {
	    // 	this.props.history.push('/portfolio');
	    // });

	    axios.post('/api/users/login', user).then(res =>{
	    	localStorage.setItem('jwtToken', res.headers.xauth);
	    	this.setState({
	        	successAlert: true,
	        	failedAlert: false
	        });
	    	setTimeout(() => window.location.href = '/portfolio', 3000);
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
			        <Icon type="loading" theme="outlined" /> Login Successful. Redirecting to Portfolio...
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.failedAlert}>
			        Email or password incorrect. 
			    </Alert>

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
				<br />
				<a href="/forget_password">Forgot Password?</a>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps,{loginAction, setCurrentUser})(Login);