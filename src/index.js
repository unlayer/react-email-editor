import React, {Component} from 'react'
import Script from 'react-load-script'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex: 1;
  display: flex;
`

const Editor = styled.div`
  flex: 1;
  display: flex;

  > iframe {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: ${props => props.minHeight || '500px'} !important;
    display: flex;
    border: 0px;
  }
`

export default class extends Component {
  render() {
    return (
      <Wrapper>
        <Script
          url="https://editor.unlayer.com/embed.js"
          onLoad={this.unlayerReady}
        />

        <Editor
          id="editor"
          style={this.props.style}
          minHeight={this.props.minHeight}
        />
      </Wrapper>
    )
  }

  unlayerReady = () => {
    unlayer.init({
      ...(this.props.options || {}),
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
}
