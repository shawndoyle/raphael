import React, {Component} from 'react';
import Toolbar from './components/Toolbar/Toolbar'
import Sketchpad from './components/Sketchpad/Sketchpad'
import PaintMenu from './components/PaintMenu/PaintMenu'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Toolbar />
        <div id='workspace'>
          <Sketchpad/>
          <PaintMenu/>
        </div>
      </div>
    );
  }
}

export default App;
