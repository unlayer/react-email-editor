import React, {Component} from 'react'
import Script from 'react-load-script'

export default class extends Component {

  render() {
    let {
      props: {
        minHeight = 500,
        style = {}
      }
    } = this

    return (
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: minHeight
      }}>
        <Script
          url="https://editor.unlayer.com/embed.js"
          onLoad={this.unlayerReady}
        />

        <div
          id="editor"
          className="editor"
          style={{...style, flex: 1}}
        />
      </div>
    )
  }

  unlayerReady = () => {
    const options = (this.props.options || {})

    if (this.props.projectId) {
      options.projectId = this.props.projectId
    }

    if (this.props.tools) {
      options.tools = this.props.tools
    }
    
    if (this.props.appearance) {
      options.appearance = this.props.appearance
    }

    if (this.props.locale) {
      options.locale = this.props.locale
    }
    
    unlayer.init({
      ...options,
      id: 'editor',
      displayMode: 'email',
    })

    // All properties starting with on[Name] are registered as event listeners.
    for (const [key, value] of Object.entries(this.props)) {
      if (/^on/.test(key) && key != 'onLoad') {
        this.addEventListener(key, value)
      }
    }

    const { onLoad } = this.props
    onLoad && onLoad()
  }

  registerCallback = (type, callback) => {
    unlayer.registerCallback(type, callback)
  }

  addEventListener = (type, callback) => {
    unlayer.addEventListener(type, callback)
  }

  loadDesign = (design) => {
    unlayer.loadDesign(design)
  }

  saveDesign = (callback) => {
    unlayer.saveDesign(callback)
  }

  exportHtml = (callback) => {
    unlayer.exportHtml(callback)
  }

  setMergeTags = (mergeTags) => {
    unlayer.setMergeTags(mergeTags)
  }
}
