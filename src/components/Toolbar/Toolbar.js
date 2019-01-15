import React, {Component} from 'react'
import DropDown from '../DropDown/DropDown'
import './Toolbar.css'

class Toolbar extends Component {
	constructor(props) {
		super(props)
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

	render() {
		const fileName = this.props.file ? this.props.file.name : 'Untitled';
		return (
			<div>
				<nav id='toolbar'>
					<h3 id='current-file'><i>{fileName}</i></h3>
					<ul onClick={this.updateDropDown} id='nav-links'>
						<li>File</li>
						<li>Edit</li>
						<li>Account</li>
					</ul>
				</nav>
				<DropDown 
			        selected={this.state.dropDownTarget}
			        undo={this.props.undo}
			        undoDisabled={this.props.undoDisabled}
			        clear={this.props.clear}
			        rotate={this.props.rotate}
			        flipV={this.props.flipV}
			        flipH={this.props.flipH}
			        download={this.props.download}
			        logout={this.props.logout}
			        save={this.props.save}
			        open={this.props.open}
			        newFile={this.props.newFile}
			    />
			</div>
		)
	}
}

export default Toolbar
