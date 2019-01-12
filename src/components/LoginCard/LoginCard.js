import React from 'react';
import './LoginCard.css';

const LoginCard = ({changeRoute}) => {
	return (
		<div id="login-card">
			<h3>MyCanvas Login</h3>
			<h4>Email:</h4>
			<input className='input' type='email'></input>
			<h4>Password:</h4>
			<input className='input' type='password'></input>
			<button><h3>Login</h3></button>
			<div id='error-msg'></div>
			<h5 onClick={() => changeRoute('register')}>Register</h5>
		</div>
	);
};

export default LoginCard;