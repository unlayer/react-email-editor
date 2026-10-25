import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import packageJson from '../../../package.json';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import type { JSONTemplate } from '@unlayer/types';
import _sample from './sample.json';

const sample = _sample as any as JSONTemplate<'email'>;

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

  a {
    align-self: center;
    color: #000;
    white-space: nowrap;
  }

  button:disabled {
    opacity: 0.5;
    cursor: wait;
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
  const [ready, setReady] = useState(false);

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign((design) => {
      console.log('saveDesign', design);
      alert('Design JSON has been logged in your developer console.');
    });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      alert('Output HTML has been logged in your developer console.');
    });
  };

  const togglePreview = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (preview) {
      unlayer?.hidePreview();
      setPreview(false);
    } else {
      unlayer?.showPreview('desktop');
      // unlayer?.showPreview({ device: 'desktop', resolution: 1024 })
      setPreview(true);
    }
  };

  const onDesignLoad = (data: { design: JSONTemplate<'email'> }) => {
    console.log('onDesignLoad', data);
    setReady(true);
  };

  const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    console.log('onLoad', unlayer);
    unlayer.addEventListener('design:loaded', onDesignLoad);
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    unlayer.loadDesign(sample);
  };

  return (
    <Container>
      <Bar>
        <h1>
          React Email Editor v{packageJson.version} (Demo) &mdash; (
          <a
            href="https://github.com/unlayer/react-email-editor"
            target="_blank"
          >
            GitHub
          </a>
          )
        </h1>

        <Link to="/elements">Try Elements</Link>
        <button onClick={togglePreview} disabled={!ready}>
          {preview ? 'Hide' : 'Show'} Preview
        </button>
        <button onClick={saveDesign} disabled={!ready}>
          Save Design
        </button>
        <button onClick={exportHtml} disabled={!ready}>
          Export HTML
        </button>
      </Bar>

      <React.StrictMode>
        <EmailEditor
          ref={emailEditorRef}
          onLoad={onLoad}
          onReady={onReady}
          options={{
            version: 'latest',
            appearance: {
              theme: 'modern_light',
            },
          }}
        />
      </React.StrictMode>
    </Container>
  );
};

export default Example;
