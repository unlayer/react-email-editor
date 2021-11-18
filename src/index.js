import React, { Component } from 'react';
import { loadScript } from './loadScript';
import pkg from '../package.json';

let lastEditorId = 0;

export default class extends Component {
  constructor(props) {
    super(props);

    this.editorId = props.editorId || `editor-${++lastEditorId}`;
  }

  componentDidMount() {
    loadScript(this.loadEditor, this.props.scriptUrl);
  }

  render() {
    let {
      props: { minHeight = 500, style = {} },
    } = this;

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: minHeight,
        }}
      >
        <div id={this.editorId} style={{ ...style, flex: 1 }} />
      </div>
    );
  }

  loadEditor = () => {
    const options = this.props.options || {};

    if (this.props.projectId) {
      options.projectId = this.props.projectId;
    }

    if (this.props.tools) {
      options.tools = this.props.tools;
    }

    if (this.props.appearance) {
      options.appearance = this.props.appearance;
    }

    if (this.props.locale) {
      options.locale = this.props.locale;
    }

    this.editor = unlayer.createEditor({
      ...options,
      id: this.editorId,
      displayMode: 'email',
      source: {
        name: pkg.name,
        version: pkg.version,
      },
    });

    // All properties starting with on[Name] are registered as event listeners.
    for (const [key, value] of Object.entries(this.props)) {
      if (/^on/.test(key) && key !== 'onLoad' && key !== 'onReady') {
        this.addEventListener(key, value);
      }
    }

    const { onLoad, onReady } = this.props;

    // @deprecated
    onLoad && onLoad();

    if (onReady) this.editor.addEventListener('editor:ready', onReady);
  };

  registerCallback = (type, callback) => {
    this.editor.registerCallback(type, callback);
  };

  addEventListener = (type, callback) => {
    this.editor.addEventListener(type, callback);
  };

  loadDesign = (design) => {
    this.editor.loadDesign(design);
  };

  saveDesign = (callback) => {
    this.editor.saveDesign(callback);
  };

  exportHtml = (callback) => {
    this.editor.exportHtml(callback);
  };

  setMergeTags = (mergeTags) => {
    this.editor.setMergeTags(mergeTags);
  };
}
