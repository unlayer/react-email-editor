import React, {Component} from 'react'
import Script from 'react-load-script'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex: 1;
  display: flex;
`

const Designer = styled.div`
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
          url="https://designer.unroll.io/assets/embed.bundle.js"
          onLoad={this.unrollReady}
        />

        <Designer
          id="editor"
          style={this.props.style}
          minHeight={this.props.minHeight}
        />
      </Wrapper>
    )
  }

  unrollReady = () => {
    unroll.init({
      id: 'editor',
      displayMode: 'email',
      projectId: this.props.projectId,
      templateId: this.props.templateId,
    })
  }

  loadDesign = (design) => {
    unroll.loadDesign(design)
  }

  saveDesign = (callback) => {
    unroll.saveDesign(callback)
  }

  exportHtml = (callback) => {
    unroll.exportHtml(callback)
  }
}
