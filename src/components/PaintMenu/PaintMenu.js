import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintBrush, faFillDrip, faEraser, faCircle, faSquare } from '@fortawesome/free-solid-svg-icons'
import InputRange from 'react-input-range'
import { SketchPicker } from 'react-color'
import './PaintMenu.css'


library.add(faPaintBrush, faFillDrip, faEraser, faCircle, faSquare)

const PaintMenu = ({color, brushSize, updateColor, updateBrushSize, updateTool, disableSlider}) => {
	const toolSelect = (tool) => {
		updateTool(tool)
		document.querySelectorAll('button').forEach(btn => {
			btn.style.backgroundColor = '#FFF'
		})
		document.querySelector('#' + tool).style.backgroundColor = 'gold'
	}
	return (
		<div id='paint-menu' className=''>
			<div>
				<h3>Paint Options</h3>
				<div id='tool-menu'>
					<button 
						id='brush'
						onClick={() => toolSelect('brush')}
					>
						<FontAwesomeIcon icon='paint-brush' />
					</button>
					<button 
						id='fill'
						onClick={() => toolSelect('fill')}
					>
						<FontAwesomeIcon icon='fill-drip' />
					</button>
					<button 
						id='erase'
						onClick={() => toolSelect('erase')}
					>
						<FontAwesomeIcon icon='eraser' />
					</button>
					<button 
						id='rectangle'
						onClick={() => toolSelect('rectangle')}
					>
						<FontAwesomeIcon icon='square' />
					</button>
					<button 
						id='circle'
						onClick={() => toolSelect('circle')}
					>
						<FontAwesomeIcon icon='circle' />
					</button>
				</div>
				<div id='brush-menu'>
					<InputRange
						disabled={disableSlider}
						minValue={1}
						maxValue={30}
						value={brushSize}
						onChange={updateBrushSize}
					/>
					<div 
						id='brush-circle'
						style=
						{{
							height: brushSize, 
							width: brushSize,
							marginTop: 10 - brushSize / 2,
							marginLeft: 20 - brushSize / 2,
						}}
					></div>
				</div>
				<div id='color-menu'>
					<SketchPicker 
						color={color}
						onChangeComplete={updateColor}
					/>
				</div>
			</div>
		</div>
	)
	
}

export default PaintMenu
