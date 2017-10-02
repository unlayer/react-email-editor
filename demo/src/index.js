import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-email-editor Demo</h1>

      <div>
        <button onClick={this.saveDesign}>Save Design</button>
        <button onClick={this.exportHtml}>Export HTML</button>
      </div>

      <Example ref={designer => this.designer = designer}/>
    </div>
  }

  saveDesign = () => {
    this.designer.saveDesign(design => {
      console.log('saveDesign', design)
    })
  }

  exportHtml = () => {
    this.designer.exportHtml(html => {
      console.log('exportHtml', html)
    })
  }
}

render(<Demo/>, document.querySelector('#demo'))
