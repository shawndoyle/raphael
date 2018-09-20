import React from 'react'
import './DropDown.css'

const DropDown = ({options}) => {
	const menuOptions = options.map(opt => {
		return <li onClick={opt.fn} key={opt.name}>{opt.name}</li>
	})
	return(
		<nav id='drop-down-menu'>
			<ul>
				{menuOptions}
			</ul>
		</nav>
	)
}

export default DropDown