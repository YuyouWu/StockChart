import React from 'react';
import { changeEmail, setCurrentUser, changePassword } from '../actions/authActions';
import { FormGroup, InputGroup, Button } from "@blueprintjs/core";
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { message } from 'antd';
import axios from 'axios';
import validator from 'email-validator';

class Profile extends React.Component {
  	constructor(props) {
		super(props);
		
		this.state={
			email:'',
			newEmail: '',
			id:'',
			oldPassword: '',
			newPassword: '',
			confirmPassword: ''
		}

    	this.props.setCurrentUser().then((res) => {
			if(res.payload._id){
				this.setState({
					id: res.payload._id,
					email: res.payload.email
				});
				// window.location.href = '/portfolio'
			} 
		});
	}

	onEmailChange = (e) => {
		this.setState({
			newEmail: e.target.value
		});
	}

	updateEmail = () => {
		if (validator.validate(this.state.newEmail)){
			this.props.changeEmail({
				id: this.state.id,
				newEmail: this.state.newEmail
			}).then(res => {
				if(res.payload.email){
					this.setState({
						email: this.state.newEmail
					});
					message.success('Email has been updated to ' + this.state.newEmail);
				} else {
					message.error('An error has occured. Please try again.');
				}
			});
		} else {
			message.error('Please enter a valid email address.');
		}
	}

	enterOldPassword = (e) => {
		this.setState({
			oldPassword: e.target.value
		});
	}

	enterNewPassword = (e) => {
		this.setState({
			newPassword: e.target.value
		});
	}

	confirmNewPassword = (e) => {
		this.setState({
			confirmPassword: e.target.value
		});
	}

	updatePassword = () => {
		if(this.state.newPassword.length < 6){
			message.error('Password must be at least 6 characters long.');
		} else {
			if(this.state.newPassword === this.state.confirmPassword){
				this.props.changePassword({
					email: this.state.email,
					password: this.state.oldPassword,
					newPassword: this.state.newPassword
				}).then(res => {
					if(res.payload.email){
						message.success('Password has been updated. You are now logged out of all other sessions.');
					} else {
						message.error('An error has occured. Please try again.');
					}
				});	
			} else {
				message.error('New passwords do not match.');
			}	
		}
	}

	render() {
		return(
			<div className="container" style={{marginTop:'20px'}}>
				<h3>Change Email</h3>
				<InputGroup 
					type="email"
					id="email"
					placeholder={this.state.email} 
					style={{width:'500px'}}
					onChange={this.onEmailChange}
				/>
				<Button 
					style={{marginTop:'20px'}} 
					text="Update Email" 
					onClick={this.updateEmail}
				/>
				<h3 style={{marginTop:'50px'}}>Change Password</h3>
				<FormGroup
					label="Old Password"
					labelFor="oldPassword"
				>
					<InputGroup	
						type="password"
						id="oldPassword"
						style={{width:'500px'}}
						onChange={this.enterOldPassword}
					/>
				</FormGroup>
				<FormGroup
					label="New Password"
					labelFor="newPassword"
					labelInfo="(password must be at least 6 characters long)"
				>
					<InputGroup 
						type="password"
						id="newPassword" 
						style={{width:'500px'}}
						onChange={this.enterNewPassword}
					/>
				</FormGroup>
				<FormGroup
					label="Confirm New Password"
					labelFor="confirmPassword"
				>
					<InputGroup 
						type="password"
						id="confirmPassword" 
						style={{width:'500px'}}
						onChange={this.confirmNewPassword}
					/>
				</FormGroup>
				<Button text="Update Password" onClick={this.updatePassword}/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps,{changeEmail, changePassword, setCurrentUser})(Profile);