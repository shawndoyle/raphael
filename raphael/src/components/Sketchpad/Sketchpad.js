import React from 'react'
import './Sketchpad.css'

const Sketchpad = ({draw, beginDrawing, endDrawing}) => {

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

export default Sketchpad