import React, {Component} from 'react'

export default class extends Component {
  componentDidMount() {
    const embedJs = "//editor.unlayer.com/embed.js?2"
    const scripts = document.querySelectorAll('script');
    let scriptLoaded = false

    scripts.forEach(script => {
      if (script.src.includes(embedJs)) {
        scriptLoaded = true
      }
    })

    if (!scriptLoaded) {
      const unlayerScript = document.createElement('script');
      unlayerScript.setAttribute('src', embedJs);
      unlayerScript.onload = () => {
        this.loadEditor();
      };
      document.head.appendChild(unlayerScript);
    } else {
      this.loadEditor();
    }
  }

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
        <div
          id="editor"
          style={{...style, flex: 1}}
        />
      </div>
    )
  }

  loadEditor = () => {
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

    this.editor = unlayer.createEditor({
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
    this.editor.registerCallback(type, callback)
  }

  addEventListener = (type, callback) => {
    this.editor.addEventListener(type, callback)
  }

  loadDesign = (design) => {
    this.editor.loadDesign(design)
  }

  saveDesign = (callback) => {
    this.editor.saveDesign(callback)
  }

  exportHtml = (callback) => {
    this.editor.exportHtml(callback)
  }

  setMergeTags = (mergeTags) => {
    this.editor.setMergeTags(mergeTags)
  }
}
