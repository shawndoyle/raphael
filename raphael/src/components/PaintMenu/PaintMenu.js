import React, {Component} from 'react'
import InputRange from 'react-input-range'
import './PaintMenu.css'

class PaintMenu extends Component {
	constructor() {
		super()
		this.state = {
			value: 10
		}
	}

	render() {
		return (
			<div id='paint-menu' className='shadow'>
				<div>
					<h3>Brush Size</h3>
					<InputRange 
						minValue={1}
						maxValue={20}
						value={this.state.value}
						onChange={value => {this.setState({ value })}}
					/>
					
				</div>
			</div>
		)
	}
}

export default PaintMenu

/*
Slider - Brush size
Common Colors
Color picker
Common shape maker
Fill tool
*/