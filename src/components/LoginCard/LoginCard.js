import React, {Component} from 'react';
import LoadingOverlay from 'react-loading-overlay';
import {ClipLoader} from 'react-spinners';

import './LoginCard.css';
import {serverURL} from './../../config/config.json';

class LoginCard extends Component {
	constructor(props) {
		super()
		this.state = {
			loading: false
		}
	}

	displayErrorMsg = (msg) => {
		document.querySelector('#error-msg').innerText = msg;
	}

	login = () => {
		this.displayErrorMsg('');
		let email = document.querySelector('#email-input').value;
		let password = document.querySelector('#password-input').value;
		if(!email) {
			return this.displayErrorMsg('Please enter an email');
		}
		if(!password) {
			return this.displayErrorMsg('Please enter a password');
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
		this.setState({loading: true});
		fetch(serverURL + '/users/login', fetchData)
		.then(res => {
			this.setState({loading: false});
			let token = res.headers.get('x-auth');
			if(token) {
				localStorage.setItem('MyCanvasToken', token);
			}
			return res.json();
		})
		.then(body => {
			this.props.changeRoute('app');
		})
		.catch(e => {
			console.log(e);
			this.displayErrorMsg('Username or password incorrect');
			this.setState({loading: false});
		});
	}

	handleKeyPress = (e) => {
		if(e.charCode === 13) {
			this.login();
		}
	}



	render() {
		const {changeRoute} = this.props;
		return (
			<div id="login-card">
				<h3>MyCanvas Login</h3>
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
				<button onClick={this.login}><h3>Login</h3></button>
				<div id='error-msg'></div>
				<LoadingOverlay 
					active={this.state.loading}
					spinner={<ClipLoader />}
				/>
				<h5 onClick={() => changeRoute('register')}>Register</h5>
			</div>
		);
	}
};

export default LoginCard;