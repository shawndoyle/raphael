import React from 'react'
import './DropDown.css'

const DropDown = ({selected, undo, undoDisabled, rotate, clear, flipV, flipH, download, logout, save, open, newFile}) => {
	if(selected === 'File') {
		return(
			<nav id='drop-down-menu'>
				<ul>
					<li 
						key='Download'
						onClick={download}
					>Download</li>
					<li 
						key='New'
						onClick={newFile}
					>New</li>
					<li 
						key='Open'
						onClick={open}
					>Open</li>
					<li 
						key='Save'
						onClick={save}
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
						style={undoDisabled ? {color: 'grey', cursor: 'default'} : {}}
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
						onClick={open}
					>View Files</li>
					<li 
						key='Logout'
						onClick={logout}
					>Logout</li>
				</ul>
			</nav>
		)
	}
	return <div style={{display: 'none'}}></div>
}

export default DropDown
