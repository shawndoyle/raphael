import React from 'react'
import './Sketchpad.css'

const Sketchpad = () => {

	return (
		<div className='shadow' id='sketchpad-wrap'>
			<canvas id='canvas'></canvas>
		</div>
	)
}

export default Sketchpad