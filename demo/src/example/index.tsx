import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import packageJson from '../../../package.json';

import EmailEditor from '../../../src';
import { EditorRef } from '../../../src/types';
import sample from './sample.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const Bar = styled.div`
  flex: 1;
  background-color: #61dafb;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 40px;

  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }

  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;

const Example = () => {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [preview, setPreview] = useState(false);

  const saveDesign = () => {
    emailEditorRef.current?.editor?.saveDesign((design) => {
      console.log('saveDesign', design);
      alert('Design JSON has been logged in your developer console.');
    });
  };

  const exportHtml = () => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      alert('Output HTML has been logged in your developer console.');
    });
  };

  const togglePreview = () => {
    if (preview) {
      emailEditorRef.current?.editor?.hidePreview();
      setPreview(false);
    } else {
      emailEditorRef.current?.editor?.showPreview('desktop');
      setPreview(true);
    }
  };

  const onDesignLoad = (data) => {
    console.log('onDesignLoad', data);
  };

  const onLoad = () => {
    console.log('onLoad');

    emailEditorRef.current?.editor?.addEventListener(
      'design:loaded',
      onDesignLoad
    );

    emailEditorRef.current?.editor?.loadDesign(sample);
  };

  const onReady = () => {
    console.log('onReady');
  };

  return (
    <Container>
      <Bar>
        <h1>React Email Editor v{packageJson.version} (Demo)</h1>

        <button onClick={togglePreview}>
          {preview ? 'Hide' : 'Show'} Preview
        </button>
        <button onClick={saveDesign}>Save Design</button>
        <button onClick={exportHtml}>Export HTML</button>
      </Bar>

      <React.StrictMode>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
      </React.StrictMode>
    </Container>
  );
};

export default Example;
