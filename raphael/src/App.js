import React, {Component} from 'react'
import Toolbar from './components/Toolbar/Toolbar'
import Sketchpad from './components/Sketchpad/Sketchpad'
import PaintMenu from './components/PaintMenu/PaintMenu'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      drawing: false,
      tool: null,
      brushSize: 10,
      color: {
        hex: '#000',
        rgb: { r:0, g:0, b:0, a:0 }
      },
    }
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <div id='workspace'>
          <Sketchpad 
            draw={this.draw}
            beginDrawing={this.beginDrawing}
            endDrawing={this.endDrawing}
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
      </div>
    );
  }

  componentDidMount() {
      //Init canvas
      const canvas = document.querySelector('#canvas')
      const context = canvas.getContext('2d')
      context.lineWidth = 10
      //Init copyCanvas
      const copyCanvas = document.createElement('canvas')
      copyCanvas.width = '600'
      copyCanvas.height = '600'
      const copyContext = copyCanvas.getContext('2d')

      document.querySelector('body').appendChild(copyCanvas) //DELETE THIS LATER

      this.setState({ canvas, context, copyCanvas, copyContext })
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

  //Activates on MouseDown event
  beginDrawing = (e) => {
    let coords = this.getCoords(e)
    let {context} = this.state
    context.beginPath()
    context.moveTo(coords.x, coords.y)
    this.setState({drawing: true, startCoords: coords})

    //Makes copy of the canvas before the drawing takes place
    let {copyContext, canvas} = this.state
    copyContext.drawImage(canvas, 0, 0)
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
        case 'fill':
          this.fill(coords)
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
    let {canvas, context, copyCanvas, startCoords} = this.state
    this.wipe(canvas, context)
    context.drawImage(copyCanvas, 0, 0)
    context.beginPath()
    context.rect(startCoords.x, startCoords.y, x - startCoords.x, y - startCoords.y)
    context.fill()
  }

  //At each update, resets canvas from one stored in memory with the rectangle drawn on top
  circle = ({ x, y}) => {
    let {canvas, context, copyCanvas, startCoords} = this.state
    this.wipe(canvas, context)
    context.drawImage(copyCanvas, 0, 0)
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

  fill = ({x, y}) => {
    const newColor = this.state.color.rgb
    const {canvas, context} = this.state
    //Loads entire image data
    let image = context.getImageData(0, 0, canvas.width, canvas.height)
    //Store selected data
    const startPos = (y * canvas.width + x) * 4
    const startR = image.data[startPos]
    const startG = image.data[startPos + 1]
    const startB = image.data[startPos + 2]


    const pixelStack = [[x, y]]
    while(pixelStack.length) {
      let newPos = pixelStack.pop()
      x = newPos[0]
      y = newPos[1]
      let pixelPos = getPixelPosition(x, y)
      while(y-- > 0 && matchStartColor(pixelPos)) {
        pixelPos = getPixelPosition(x, y)
      }
      y++
      console.log(x, y)
      let reachLeft = false
      let reachRight = false
      while(y < canvas.height - 1 && matchStartColor(pixelPos)) {
        // image = colorPixel(pixelPos)
        // if(x > 0) {
        //   if(matchStartColor(pixelPos - 4)) {
        //     if(!reachLeft) {
        //       pixelStack.push([x - 1, y])
        //       reachLeft = true
        //     }
        //   } else if(reachLeft) {
        //     reachLeft = false
        //   }
        // }
        // if(x < canvas.width - 1) {
        //   if(matchStartColor(pixelPos + 4)) {
        //     if(!reachRight) {
        //       pixelStack.push([x + 1, y])
        //       reachRight = true
        //     }
        //   } else if(reachRight) {
        //     reachRight = false
        //   }
        // }
        y++
        pixelPos = getPixelPosition(x, y)
        // console.log(pixelPos)
      }
    }


    this.wipe(canvas, context)
    context.putImageData(image, 0, 0)

    function colorPixel(pixelPos) {
      image.data[pixelPos] = newColor.r
      image.data[pixelPos + 1] = newColor.g
      image.data[pixelPos + 2] = newColor.b
      image.data[pixelPos + 3] = newColor.a * 255
      return image
    }

    function getPixelPosition(x, y) {
      return (y * canvas.width + x) * 4
    }

    function matchStartColor(pixelPos){
      let r = image.data[pixelPos]
      let g = image.data[pixelPos + 1]
      let b = image.data[pixelPos + 2]
      
      return (r === startR && g === startG && b === startB)
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
    let {copyContext, canvas} = this.state
    copyContext.drawImage(canvas, 0, 0)
  }
}

export default App;

