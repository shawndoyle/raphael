import React from 'react'
import './DropDown.css'

const DropDown = ({selected, undo, undoDisabled, rotate, clear, flipV, flipH}) => {
	if(selected === 'File') {
		return(
			<nav id='drop-down-menu'>
				<ul>
					<li 
						key='Download'
						onClick={console.log}
					>Download</li>
					<li 
						key='New'
						onClick={console.log}
					>New</li>
					<li 
						key='Open'
						onClick={console.log}
					>Open</li>
					<li 
						key='Save'
						onClick={console.log}
					>Save</li>
				</ul>
			</nav>
		)
	}
	if(selected === 'Edit') {
		return(
			<nav id='drop-down-menu'>
				<ul>
					<li 
						key='Undo'
						onClick={undo}
						style={undoDisabled ? {color: '#000', cursor: 'default'} : {}}
					>Undo</li>
					<li 
						key='Rotate'
						onClick={rotate}
					>Rotate</li>
					<li 
						key='Flip-Vertically'
						onClick={flipV}
					>Flip Vertically</li>
					<li 
						key='Flip-Horizontally'
						onClick={flipH}
					>Flip Horizontally</li>
					<li 
						key='Clear'
						onClick={clear}
					>Clear</li>
				</ul>
			</nav>
		)		
	}
	if(selected === 'Account') {
		return(
			<nav id='drop-down-menu'>
				<ul>
					<li 
						key='View-Files'
						onClick={console.log}
					>View Files</li>
					<li 
						key='Account-Settings'
						onClick={console.log}
					>Account Settings</li>
				</ul>
			</nav>
		)
	}
	return <div style={{display: 'none'}}></div>
}

export default DropDown
