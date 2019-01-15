import React, {Component} from 'react'
import './Sketchpad.css'

class Sketchpad extends Component {
	constructor(props) {
		super();
	}


	render() {
		const {beginDrawing, endDrawing, draw} = this.props;
		return (
			<div className='shadow' id='sketchpad-wrap'>
				<canvas 
					id='canvas'
					height='600'
					width='600'
					onMouseDown={beginDrawing}
					onMouseUp={endDrawing}
					onMouseLeave={endDrawing}
					onMouseMove={draw}
				></canvas>
			</div>
		)
	}

	componentDidMount() {
		this.props.init();
	}
}

export default Sketchpad