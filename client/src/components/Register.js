import React from 'react';

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
		        <form noValidate>
					<input type="text" name="Email"/>
					<input type="text" name="Password"/>
	                <input type="submit"/>
		        </form>
			</div>
		);
	}
}

export default Register;