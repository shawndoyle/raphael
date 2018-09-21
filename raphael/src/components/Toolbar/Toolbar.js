import React, {Component} from 'react'
import DropDown from '../DropDown/DropDown'
import './Toolbar.css'

class Toolbar extends Component {
	constructor() {
		super()
		this.state = {
			dropDownTarget: 'None',
		}
	}

	updateDropDown = (e) => {
		if(e.target.innerText === this.state.dropDownTarget) {
			this.setState({
				dropDownTarget: 'None',
			})
		} else {
			this.setState({
				dropDownTarget: e.target.innerText
			})
		}
	}

	dropDownOptions = {
		'None': [],
		'File': [
			{name: 'Download', fn: () => console.log('Download')},
			{name: 'New', fn: () => console.log('New')},
			{name: 'Open', fn: () => console.log('Open')},
			{name: 'Save', fn: () => console.log('Save')},
			{name: 'Delete', fn: () => console.log('Delete')},
		],
		'Edit': [
			{name: 'Undo', fn: () => console.log('Undo')},
			{name: 'Rotate', fn: () => console.log('Rotate')},
			{name: 'Mirror', fn: () => console.log('Mirror')},
			{name: 'Clear', fn: () => console.log('Clear')},
		],
		'Account': [
			{name: 'Security', fn: () => console.log('Secutity')},
			{name: 'View Files', fn: () => console.log('View Files')},			
		],
	}


	render() {
		return (
			<div>
				<nav id='toolbar'>
					<ul onClick={this.updateDropDown} id='nav-links'>
						<li>File</li>
						<li>Edit</li>
						<li>Account</li>
					</ul>
				</nav>
				<DropDown 
			        options={this.dropDownOptions[this.state.dropDownTarget]}
			    />
			</div>
		)
	}
}

export default Toolbar
