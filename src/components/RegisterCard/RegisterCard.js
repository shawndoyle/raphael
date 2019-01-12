import React from 'react';
import '../LoginCard/LoginCard.css';
import {serverURL} from '../../config/config.json';

const RegisterCard = ({changeRoute}) => {

	const displayErrorMsg = (msg) => {
		document.querySelector('#error-msg').innerText = msg;
	}

	const register = () => {
		displayErrorMsg('');
		let email = document.querySelector('#email-input').value;
		let password = document.querySelector('#password-input').value;
		let confirmPw = document.querySelector('#confirm-password-input').value;
		if(!email) {
			return displayErrorMsg('Please enter an email');
		}
		if(!password || !confirmPw) {
			return displayErrorMsg('Please enter and confirm password');
		}
		if(password !== confirmPw) {
			return displayErrorMsg('Passwords do not match!');
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
		fetch(serverURL + '/users/new', fetchData)
		.then(res => {
			let token = res.headers.get('x-auth');
			if(!token) {
				return displayErrorMsg('Server error: unable to register')
			}
			localStorage.setItem('MyCanvasToken', token);
			return res.json();
		})
		.then(json => {
			console.log(json);
		})
		.catch(e => {
			console.log(e);
		});
	}

	return (
		<div id="login-card">
			<h3>MyCanvas Register</h3>

			<h4>Email:</h4>
			<input 
				className='input' 
				type='email' 
				id='email-input'
			></input>

			<h4>Password:</h4>
			<input 
				className='input' 
				type='password' 
				id='password-input'
			></input>

			<h4>Confirm Password:</h4>
			<input 
				className='input' 
				type='password'
				id='confirm-password-input'
			></input>

			<button 
				onClick={register}
			><h3>Register</h3></button>
			<div id='error-msg'></div>
			<h5 onClick={() => changeRoute('login')}>Login</h5>
		</div>
	);
};

export default RegisterCard;