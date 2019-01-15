import React, {Component} from 'react';
import {ClipLoader} from 'react-spinners';
import Modal from 'react-responsive-modal';

import './FileMenu.css';
import {serverURL} from './../../config/config.json';


class FileMenu extends Component {
	constructor(props) {
		super();
		this.state = {
			files: null,
			deleteModal: false,
			toBeDeleted: null,
		}
	}
	render() {
		let tableRows = [];
		if(this.state.files === null) {
			tableRows = <tr><td></td><td className='loader'><ClipLoader /></td></tr>
		} else if(this.state.files.length === 0) {
			tableRows = <tr><td></td><td>You currently have no files</td></tr>
		} else if(this.state.files === 'Error') {
			tableRows = <tr>
				<td></td><td>Unable to reach the server</td><td></td><td><button onClick={this.getFiles}>Retry</button></td>
			</tr>
		} else {
			this.state.files.forEach(file => {
		      	tableRows.push(
			      	<tr key={file._id} id={file._id}>
			      		<td>{file.name}</td>
			      		<td>{new Date(file.lastUpdatedAt).toLocaleString()}</td>
			      		<td><button onClick={this.openFile}>Open</button></td>
			      		<td><button onClick={this.deleteModalOpen}>Delete</button></td>
			      	</tr>
			    )
		    })
		}
		return (
			<div id='file-menu'>
				<span id='close-btn' onClick={this.props.close}>&times;</span>
				<h1>Files</h1>
				<table>
					<thead>
						<tr>
							<th className='wide'>Name</th>
							<th className='wide'>Last Saved</th>
							<th className='thin'></th>
							<th className='thin'></th>
						</tr>
					</thead>
					<tbody>
						{tableRows}
					</tbody>
				</table>
				<Modal open={this.state.deleteModal} onClose={this.deleteModalClose} center>
					<h4>Are you sure you wish to delete this file?</h4>
					<button onClick={this.deleteFile}>Delete</button>&nbsp;&nbsp;
					<button onClick={this.deleteModalClose}>Cancel</button>
				</Modal>
			</div>
		);
	}

	componentDidMount() {
		this.getFiles();
	}

	getFiles = () => {
		this.setState({files: null});
		let token = localStorage.getItem('MyCanvasToken');
	    const fetchData = {
	      method: 'GET',
	      mode: 'cors',
	      headers: {
	        'x-auth': token
	      }
	    };
	    fetch(`${serverURL}/files`, fetchData)
	    .then(res => {
	      if(res.status !== 200) {
	        return Promise.reject();
	      }
	      return res.json();
	    })
	    .then(json => {
	      this.setState({files: json.files});
	    })
	    .catch(e => {
	      this.setState({files: 'Error'});
	    });
	}

	deleteModalOpen = (evt) => {
		this.setState({
			deleteModal: true,
			toBeDeleted: evt.target.parentNode.parentNode.getAttribute('id')
		});
	}

	deleteModalClose = () => {
		this.setState({deleteModal: false});
	}

	deleteFile = () => {
		const _id = this.state.toBeDeleted;
		let token = localStorage.getItem('MyCanvasToken');
	    const fetchData = {
	      method: 'DELETE',
	      mode: 'cors',
	      headers: {
	        'x-auth': token
	      }
	    };
	    fetch(`${serverURL}/files/${_id}`, fetchData)
	    .then(res => {
	    	if(res.status !== 200) {
	    		return Promise.reject();
	    	}
	    	this.setState({
	    		files: this.state.files.filter(file => file._id !== _id),
	    		deleteModal: false
	    	});
	    	if(_id === this.props.currentFile._id) {
	    		this.props.deleteCurrentFile();
	    	}
	    })
	    .catch(e => {
	    	console.log(e);
	    	this.setState({deleteModal: false});
	    })
	}

	openFile = (evt) => {
		let _id = evt.target.parentNode.parentNode.getAttribute('id');
		let file = this.state.files.filter(file => file._id === _id)[0];
		this.props.loadFile(file);
	}
}

export default FileMenu;