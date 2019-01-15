import React, {Component} from 'react';
import Validator from 'validator';
import LoadingOverlay from 'react-loading-overlay';
import {ClipLoader} from 'react-spinners';

import '../LoginCard/LoginCard.css';
import {serverURL} from '../../config/config.json';

class RegisterCard extends Component {
	constructor(props) {
		super();
		this.state = {
			loading: false
		}
	}

	displayErrorMsg = (msg) => {
		document.querySelector('#error-msg').innerText = msg;
	}

	register = () => {
		this.displayErrorMsg('');
		let email = document.querySelector('#email-input').value;
		let password = document.querySelector('#password-input').value;
		let confirmPw = document.querySelector('#confirm-password-input').value;
		if(!email) {
			return this.displayErrorMsg('Please enter an email');
		}
		if(!Validator.isEmail(email)) {
			return this.displayErrorMsg('Please enter a valid email address');
		}
		if(password.length < 8) {
			return this.displayErrorMsg('Passwords must be at least 8 characters long');
		}
		if(!password || !confirmPw) {
			return this.displayErrorMsg('Please enter and confirm password');
		}
		if(password !== confirmPw) {
			return this.displayErrorMsg('Passwords do not match!');
		}

		let data = JSON.stringify({email, password});
		const fetchData = {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		};
		this.setState({loading: true})
		fetch(serverURL + '/users/new', fetchData)
		.then(res => {
			this.setState({loading: false});
			let token = res.headers.get('x-auth');
			if(token) {
				localStorage.setItem('MyCanvasToken', token);
			}
			return res.json();
		})
		.then(body => {
			if(body.code === 11000) {
				return this.displayErrorMsg('Email address is already in use');
			}
			if(body.name === "ValidationError") {
				return this.displayErrorMsg('Not a valid email address');
			}
			this.props.changeRoute('app');
		})
		.catch(e => {
			console.log(e);
			this.displayErrorMsg('Server error: unable to register');
			this.setState({loading: false});
		});
	}

	handleKeyPress = (e) => {
		if(e.charCode === 13) {
			this.register();
		}
	}

	render() {
		const {changeRoute} = this.props;
		return (
			<div id="login-card">
				<h3>MyCanvas Register</h3>

				<h4>Email:</h4>
				<input 
					className='input' 
					type='email' 
					id='email-input'
					onKeyPress={this.handleKeyPress}
				></input>

				<h4>Password:</h4>
				<input 
					className='input' 
					type='password' 
					id='password-input'
					onKeyPress={this.handleKeyPress}
				></input>

				<h4>Confirm Password:</h4>
				<input 
					className='input' 
					type='password'
					id='confirm-password-input'
					onKeyPress={this.handleKeyPress}
				></input>

				<button 
					onClick={this.register}
				><h3>Register</h3></button>
				<div id='error-msg'></div>
				<LoadingOverlay 
					active={this.state.loading}
					spinner={<ClipLoader />}
				/>
				<h5 onClick={() => changeRoute('login')}>Login</h5>
			</div>
		);
	}
};

export default RegisterCard;