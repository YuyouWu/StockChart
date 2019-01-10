import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import axios from 'axios';

class ResetPasswordWithToken extends React.Component {
  	constructor(props) {
		super(props);
    	this.state = {
    		successAlert: false,
			failedAlert: false,
			token: props.match.params.token
		}
	}

	handlePasswordReset = (e) => {
		e.preventDefault();

		var newPassword = e.target.elements.newPassword.value
		var confirmNewPassword = e.target.elements.confirmNewPassword.value
		if(newPassword !== confirmNewPassword){
			this.setState({
				successAlert: false,
				failedAlert: true
			});
		} else {
			
			var password = {
				newPassword: newPassword
			};
			
			axios.post('/api/updatePasswordToken/'+ this.state.token, password).then(res =>{
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
	}

	render() {
		return(
			<div className="container">
				<Alert style={{marginTop: 25+'px'}} color="success" isOpen={this.state.successAlert}>
			        Password has been changed. Please login with your new password.
			    </Alert>
			    <Alert style={{marginTop: 25+'px'}} color="danger" isOpen={this.state.failedAlert}>
			        New passwords do not match.
			    </Alert>

      			<Form onSubmit={this.handlePasswordReset}>
      				<br />
        			<FormGroup>
          				<Label for="password">New Password</Label>
			        	<Input type="password" name="newPassword" id="newPassword" placeholder="New Password" />
			        </FormGroup>
        			<FormGroup>
        				<Label for="password">Confirm New Password</Label>
          				<Input type="password" name="confirmNewPassword" id="confirmNewPassword" placeholder="Confirm New Password" />
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

export default connect(mapStateToProps,{})(ResetPasswordWithToken);