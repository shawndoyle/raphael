import React, {Component} from 'react'
import _ from 'lodash'
import download from 'downloadjs'
import Modal from 'react-responsive-modal'

import Toolbar from './components/Toolbar/Toolbar'
import Sketchpad from './components/Sketchpad/Sketchpad'
import PaintMenu from './components/PaintMenu/PaintMenu'
import LoginCard from './components/LoginCard/LoginCard'
import RegisterCard from './components/RegisterCard/RegisterCard'
import FileMenu from './components/FileMenu/FileMenu'
import {serverURL} from './config/config.json'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      route: 'login',
      drawing: false,
      tool: null,
      brushSize: 10,
      color: {
        hex: '#000',
        rgb: { r:0, g:0, b:0, a:0 }
      },
      file: null,
      undoDisabled: true,
      errorModalOpen: false,
      errorModalMsg: 'This is the modal',
      saveModalOpen: false,
      saveModalText: 'Save Canvas:',
      saved: true,
      saveCheckModal: false,
      saveCheckModalAction: null,
    }
  }

  render() {
    if(this.state.route === 'app') {
      return (
        <div className="App">
          <Toolbar 
            undo={this.undo}
            undoDisabled={this.state.undoDisabled}
            clear={() => this.wipe(this.state.canvas, this.state.context)}
            rotate={this.rotate}
            flipV={this.flipVertical}
            flipH={this.flipHorizontal}
            download={this.download}
            logout={this.logout}
            save={this.save}
            open={this.openFileMenuHandler}
            file={this.state.file}
            newFile={this.createNewFileHandler}
          />
          <div id='workspace'>
            <Sketchpad 
              draw={this.draw}
              beginDrawing={this.beginDrawing}
              endDrawing={this.endDrawing}
              init={this.init}
            />
            <PaintMenu
              color={this.state.color}
              brushSize={this.state.brushSize}
              updateColor={this.updateColor}
              updateBrushSize={this.updateBrushSize}
              updateTool={this.updateTool}
              disableSlider={this.state.tool === 'circle' || this.state.tool === 'rectangle' || this.state.tool === 'fill'}
            />
          </div>

          <Modal open={this.state.errorModalOpen} onClose={this.onCloseErrorModal} center>
            <h2>{this.state.errorModalMsg}</h2>
          </Modal>

          <Modal open={this.state.saveModalOpen} onClose={this.onCloseSaveModal}>
            <h2>{this.state.saveModalText}</h2>
            <span>Enter name:&nbsp;<input id='save-name' onKeyPress={this.onSaveModalKeypress}></input></span>
            <button onClick={this.saveBtn}>Save</button>
          </Modal>

          <Modal open={this.state.saveCheckModal} onClose={this.onCloseSaveCheckModal}>
            <h2>You haven't saved your canvas</h2>
            <button onClick={this.closeSaveModalCheckAndSave}>Save</button>
            &nbsp;<button onClick={this.closeSaveModalCheckDontSave}>Don't save</button>
          </Modal>
        </div>
      );
    } else if(this.state.route === 'open') {
      return (
        <FileMenu 
          close={this.closeFileMenu}
          files={this.state.allFiles}
          loadFile={this.loadFile}
          currentFile={this.state.file}
          deleteCurrentFile={this.deleteCurrentFile}
        />
      );
    } else if(this.state.route === 'login') {
      return (
        <LoginCard changeRoute={this.changeRoute} />
      );
    } else if(this.state.route === 'register') {
      return (
        <RegisterCard changeRoute={this.changeRoute} />
      );
    }
  }

  init = () => {
    console.log('init');
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
    context.lineWidth = 10;

    if(this.state.canvas) {
      const oldCanvas = this.state.canvas;
      context.drawImage(oldCanvas, 0, 0);
    }
    
    if(this.state.file) {
      let img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0);
      }
      img.src = this.state.file.dataURL;
    }

    //Init copyCanvas
    const copyCanvas = document.createElement('canvas')
    copyCanvas.width = '600'
    copyCanvas.height = '600'
    const copyContext = copyCanvas.getContext('2d')
    
    this.setState({canvas, context, copyContext, copyCanvas});
  }

  reset = () => {
    this.setState({
      canvas: undefined,
      context: undefined,
      copyCanvas: undefined,
      copyContext: undefined,
      drawing: false,
      tool: null,
      brushSize: 10,
      color: {
        hex: '#000',
        rgb: { r:0, g:0, b:0, a:0 }
      },
      file: null,
      undoDisabled: true,
      errorModalOpen: false,
      errorModalMsg: 'This is the modal',
      saveModalOpen: false,
      saveModalText: 'Save Canvas:',
      saved: true,
      saveCheckModal: false,
      saveCheckModalAction: null,
    })

  }

  //Opens modal with message
  sendErrorModalMessage = (msg) => {
    this.setState({
      errorModalOpen: true,
      errorModalMsg: msg
    });
  }

  onCloseErrorModal = () => {
    this.setState({
      errorModalOpen: false,
      errorModalMsg: ''
    })
  }

  onCloseSaveModal = () => {
    this.setState({saveModalOpen: false});
  }

  onSaveModalKeypress = (e) => {
    if(e.charCode === 13) {
      this.saveBtn();
    }
  }

  onCloseSaveCheckModal = () => {
    this.setState({saveCheckModal: false, saveCheckModalAction: null});
  }

  closeSaveModalCheckAndSave = () => {
    this.save();
    this.setState({saveCheckModal:false, saveCheckModalAction: null});
  }

  closeSaveModalCheckDontSave = () => {
    let action = this.state.saveCheckModalAction;
    this.setState({saveCheckModal: false, saveCheckModalAction: null}, action);
  }

  //Translates MouseEvent coordinates to coordinates on the canvas
  getCoords = (e) => {
      let box = this.state.canvas.getBoundingClientRect()
      let x = Math.ceil(e.clientX - box.left)
      let y = Math.ceil(e.clientY - box.top)
      return {x, y}
  }

  //Clears canvas
  wipe = (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  //Makes a copy of the current canvas state
  saveCanvas = () => {
    let {copyCanvas, copyContext, canvas} = this.state
    this.wipe(copyCanvas, copyContext)
    copyContext.drawImage(canvas, 0, 0)
  }

  //Restores canvas to saved version
  restoreCanvas = () => {
    let {canvas, context, copyCanvas} = this.state;
    this.wipe(canvas, context);
    context.drawImage(copyCanvas, 0, 0);
  }

  //Activates on MouseDown event
  beginDrawing = (e) => {
    let coords = this.getCoords(e)
    let {context} = this.state
    context.beginPath()
    context.moveTo(coords.x, coords.y)
    this.saveCanvas()
    this.setState({drawing: true, startCoords: coords, undoDisabled: false, saved: false})

    if(this.state.tool === 'fill') {
      this.fill(coords)
    }
  }

  //Activates on MouseUp event
  endDrawing = () => {
    this.setState({drawing: false})
  }

  draw = (e) => {
    if(this.state.drawing) {
      let coords = this.getCoords(e)
      switch(this.state.tool){
        case 'brush':
          this.brush(coords)
          break
        case 'erase':
          this.erase(coords)
          break
        case 'rectangle':
          this.rectangle(coords)
          break
        case 'circle':
          this.circle(coords)
          break
        default:
          break
      }
    }
  }

  brush = ({x, y}) => {
    let {context} = this.state
    context.lineTo(x, y)
    context.stroke()
  }

  erase = (coords) => {
    let {context} = this.state
    context.strokeStyle = '#FFF'
    this.brush(coords)
    context.strokeStyle = this.state.color.hex
  }

  //At each update, resets canvas from one stored in memory with the rectangle drawn on top
  rectangle = ({x, y}) => {
    let {context, startCoords} = this.state
    this.restoreCanvas()
    context.beginPath()
    context.rect(startCoords.x, startCoords.y, x - startCoords.x, y - startCoords.y)
    context.fill()
  }

  //At each update, resets canvas from one stored in memory with the rectangle drawn on top
  circle = ({ x, y}) => {
    let {context, startCoords} = this.state
    this.restoreCanvas()
    context.beginPath()
    let centerX = (startCoords.x + x) / 2
    let centerY = (startCoords.y + y) / 2
    let radius = Math.max(
      Math.abs(startCoords.x - x) / 2,
      Math.abs(startCoords.y - y) / 2
    )
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    context.fill()
  }

  //Flood fill algorithm
  fill = ({x, y}) => {
    let startX = x
    let startY = y
    const {canvas, context} = this.state

    const replacementColor = this.state.color.rgb
    replacementColor.a *= 255 //Canvas images use a 0-255 scale; color picker returns a 0-1

    //Loads entire image data
    let image = context.getImageData(0, 0, canvas.width, canvas.height)

    const targetColor = colorOf(pos(startX, startY))

    if(!_.isEqual(targetColor, replacementColor)) {
      let nodeQueue = []
      nodeQueue.push([startX, startY])
      while(nodeQueue.length) {
        let [x, y] = nodeQueue.pop()
        //Find furthest West and East points within area
        let w = x
        while(w > 0 && _.isEqual(colorOf(pos(w, y)), targetColor)) {
          w--
        }
        let e = x
        while(e < canvas.width && _.isEqual(colorOf(pos(e, y)), targetColor)) {
          e++
        }

        for(let i = w; i <= e; i++) {
          //Color node
          image.data[pos(i, y)] = replacementColor.r
          image.data[pos(i, y) + 1] = replacementColor.g
          image.data[pos(i, y) + 2] = replacementColor.b
          image.data[pos(i, y) + 3] = replacementColor.a

          //Check if North and South nodes need to be added to queue
          if(_.isEqual(colorOf(pos(i, y - 1)), targetColor) && y >= 0) {
            nodeQueue.push([i, y - 1])
          }
          if(_.isEqual(colorOf(pos(i, y + 1)), targetColor) && y < canvas.width - 1) {
            nodeQueue.push([i, y + 1])
          }
        }
      }
    }

    this.wipe(canvas, context)
    context.putImageData(image, 0, 0)

    function pos(x, y) {
      return (y * canvas.width + x) * 4
    }

    function colorOf(n) {
      return {
        r: image.data[n],
        g: image.data[n + 1],
        b: image.data[n + 2],
        a: image.data[n + 3]
      }
    }
  }

  updateBrushSize = (value) => {
    let {context} = this.state
    context.lineWidth = value
    this.setState({brushSize: value})
  }
  updateColor = (value) => {
    let {context} = this.state
    context.strokeStyle = value.hex
    context.fillStyle = value.hex
    this.setState({color: value})
  }
  updateTool = (value) => {
    this.setState({tool: value})
  }

  undo = () => {
    if(!this.state.undoDisabled) {
      this.restoreCanvas()
      this.setState({undoDisabled: true})
    }
  }

  rotate = () => {
    this.setState({saved: false});
    let {canvas, context} = this.state
    this.saveCanvas()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(Math.PI / 2)
    context.translate(-canvas.width / 2, -canvas.height / 2)
    this.restoreCanvas()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(-Math.PI / 2)
    context.translate(-canvas.width / 2, -canvas.height / 2)
  }

  flipVertical = () => {
    this.setState({saved: false});
    this.saveCanvas()
    let {canvas, context} = this.state 
    let image = context.getImageData(0, 0, canvas.width, canvas.height)
    let newImage = context.createImageData(canvas.width, canvas.height)
    const rowLength = canvas.width * 4
    //Cannot mutate image data, it must be changed individually
    for(let row = 0; row < canvas.height; row++) {
      for(let col = 0; col < rowLength; col++) {
        newImage.data[(canvas.height - 1 - row) * rowLength + col] = image.data[rowLength * row + col]
      }
    }
    this.wipe(canvas, context)
    context.putImageData(newImage, 0, 0)
  }

  flipHorizontal = () => {
    this.setState({saved: false});
    this.saveCanvas()
    let {canvas, context} = this.state
    let image = context.getImageData(0, 0, canvas.width, canvas.height)
    let newImage = context.createImageData(canvas.width, canvas.height)
    const rowLength = canvas.width * 4
    //Cannot mutate image data, it must be changed individually
    for(let row = 0; row < canvas.height; row++) {
      let currentRow = image.data.slice(row * rowLength, (row + 1) * rowLength)
      currentRow = _.chunk(currentRow, 4)
      currentRow.reverse()
      currentRow = _.flatten(currentRow)
      for(let col = 0; col < currentRow.length; col++) {
        newImage.data[row * rowLength + col] = currentRow[col]
      }
    }
    this.wipe(canvas, context)
    context.putImageData(newImage, 0, 0)
  }

  download = () => {
    const {canvas} = this.state;
    const name = this.state.file ? this.state.file.name : 'MyCanvas';
    const dataURL = canvas.toDataURL();
    download(dataURL, `${name}.png`, 'image/png');
  }

  changeRoute = (route) => {
    this.setState({route});
  }

  logout = () => {
    let token = localStorage.getItem('MyCanvasToken');
    const fetchData = {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'x-auth': token
      }
    };
    fetch(serverURL + '/users/logout', fetchData)
    .then(res => {
      if(res.status !== 200) {
        return Promise.reject();
      }
      this.changeRoute('login');
      localStorage.removeItem('MyCanvasToken');
      this.reset();
    })
    .catch(e => {
      this.sendErrorModalMessage('Error logging out:', e);
    });
  }

  save = () => {
    if(this.state.file) {
      let token = localStorage.getItem('MyCanvasToken');
      let {_id} = this.state.file;
      let dataURL = this.state.canvas.toDataURL();
      let data = JSON.stringify({dataURL});
      const fetchData = {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'x-auth': token,
          'Content-Type': 'application/json'
        },
        body: data
      };
      fetch(`${serverURL}/files/${_id}`, fetchData)
      .then(res => {
        if(res.status !== 200) {
          return Promise.reject();
        }
        return res.json();
      })
      .then(json => {
        this.setState({file: json.file, saved: true});
        this.sendErrorModalMessage('Save successful!');
      })
      .catch(e => {
        this.sendErrorModalMessage('Error: Unable to save to server');
      });
    } else {
      this.setState({saveModalOpen: true, saveModalText: 'Save Canvas:'});
    }
  }

  saveBtn = () => {
    let token = localStorage.getItem('MyCanvasToken');
    let name = document.querySelector('#save-name').value;
    let dataURL = this.state.canvas.toDataURL();
    let data = JSON.stringify({name, dataURL});
    const fetchData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'x-auth': token,
        'Content-Type': 'application/json'
      },
      body: data
    };
    fetch(serverURL + '/files', fetchData)
    .then(res => {
      if(res.status !== 200) {
        return Promise.reject()
      }
      return res.json();
    })
    .then(json => {
      this.setState({
        file: json,
        saveModalOpen: false,
        saved: true
      });
      this.sendErrorModalMessage('Save successful!');
    })
    .catch(e => {
      this.setState({saveModalOpen: false});
      this.sendErrorModalMessage('Error: Unable to save to server');
    })
  }

  openFileMenuHandler = () => {
    if(this.state.saved) {
      this.openFileMenu()
    } else {
      this.setState({
        saveCheckModal: true,
        saveCheckModalAction: this.openFileMenu
      });
    }
  }

  openFileMenu = () => {
    this.setState({route: 'open'});
  }
  closeFileMenu = () => {
    this.setState({
      route: 'app',
      saveCheckModal: false,
    });

    console.log(this.state);
  }

  loadFile = (file) => {
    this.setState({
      route: 'app',
      canvas: undefined, 
      file
    });
  }

  createNewFileHandler = () => {
    if(this.state.saved) {
      this.createNewFile()
    } else {
      this.setState({
        saveCheckModal: true,
        saveCheckModalAction: this.createNewFile
      });
    }
  }

  createNewFile = () => {
    let {canvas, context} = this.state;
    this.wipe(canvas, context);
    this.setState({saveModalOpen: true, saveModalText: 'New Canvas:'});
  }

  deleteCurrentFile = () => {
    let {canvas, context} = this.state;
    this.setState({file: null});
    this.wipe(canvas, context);
  }
}

export default App;

