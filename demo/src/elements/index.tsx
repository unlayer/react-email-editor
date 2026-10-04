import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EmailEditor, {
  type EditorRef,
  type EmailEditorProps,
} from 'react-email-editor';
import { createWelcomeDesign } from './welcome';
import { readSavedDesign, saveDesign, type EmailDesign } from './storage';
import welcomeSource from './welcome.tsx?raw';
import './style.css';

type ExportedEmail = { design: EmailDesign; html: string };

export default function ElementsExample() {
  const editorRef = useRef<EditorRef>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Loading the editor…');
  const [error, setError] = useState('');
  const [output, setOutput] = useState<ExportedEmail | null>(null);
  const [format, setFormat] = useState<'html' | 'json'>('html');

  useEffect(() => {
    if (ready) return;
    const timeout = window.setTimeout(() => {
      setStatus(
        'The editor is still loading. Check your connection or browser blockers, then reload.'
      );
    }, 30_000);
    return () => window.clearTimeout(timeout);
  }, [ready]);

  const onReady = useCallback<NonNullable<EmailEditorProps['onReady']>>(
    (editor) => {
      let message = 'React template loaded. Edit it, then save and export.';
      editor.addEventListener('design:loaded', () => {
        setReady(true);
        setStatus(message);
      });
      let saved: EmailDesign | null = null;
      try {
        saved = readSavedDesign(window.localStorage);
        if (saved)
          message =
            'Your saved design was reopened. Edit it, then save and export.';
      } catch {
        setError(
          'Could not read a saved design. The React template was loaded instead.'
        );
      }
      editor.loadDesign(saved ?? createWelcomeDesign());
    },
    []
  );

  const exportEmail = () => {
    if (!ready || busy || !editorRef.current?.editor) return;
    setBusy(true);
    setError('');
    try {
      editorRef.current.editor.exportHtml(({ design, html }) => {
        setOutput({ design, html });
        try {
          saveDesign(window.localStorage, design);
          setStatus(
            'Saved in this browser. Reload this page to reopen your edits.'
          );
        } catch {
          setError(
            'Export succeeded, but browser storage is unavailable. Download the JSON to keep your edits.'
          );
        } finally {
          setBusy(false);
        }
      });
    } catch {
      setError('Could not export the design. Please try again.');
      setBusy(false);
    }
  };

  const contents = output
    ? format === 'html'
      ? output.html
      : JSON.stringify(output.design, null, 2)
    : '';

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(contents);
      setStatus(`${format.toUpperCase()} copied.`);
    } catch {
      setError(
        'Could not copy. Select the output below or download it instead.'
      );
    }
  };

  const downloadOutput = () => {
    const url = URL.createObjectURL(
      new Blob([contents], {
        type: format === 'html' ? 'text/html' : 'application/json',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `welcome.${format}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="elements-demo">
      <header>
        <Link to="/">← Basic editor</Link>
        <h1>React templates, visually editable</h1>
        <p>
          This welcome email was written with{' '}
          <a href="https://github.com/unlayer/elements">Unlayer Elements</a>.
          Edit it below, then save and export it.
        </p>
        <p className="hint">
          Demo saves stay in this browser. Your application would store design
          JSON in its own backend.
        </p>
        <button onClick={exportEmail} disabled={!ready || busy}>
          {busy ? 'Exporting…' : 'Save and export'}
        </button>
        <p role="status">{status}</p>
        {error && <p role="alert">{error}</p>}
      </header>
      <div className="workspace">
        <section aria-label="Visual editor" className="editor-panel">
          <EmailEditor ref={editorRef} onReady={onReady} minHeight={650} />
        </section>
        <section className="output-panel" aria-label="Exported email">
          <h2>Exported email</h2>
          <p>Save and export to inspect the latest visual edits.</p>
          <div className="output-actions">
            <label>
              Output{' '}
              <select
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as 'html' | 'json')
                }
              >
                <option value="html">HTML</option>
                <option value="json">Design JSON</option>
              </select>
            </label>
            <button disabled={!output} onClick={copyOutput}>
              Copy
            </button>
            <button disabled={!output} onClick={downloadOutput}>
              Download
            </button>
          </div>
          <textarea
            aria-label="Exported output"
            readOnly
            value={contents}
            placeholder="Your exported HTML or JSON will appear here."
          />
        </section>
      </div>
      <details>
        <summary>View the React template</summary>
        <pre>
          <code>{welcomeSource}</code>
        </pre>
      </details>
      <footer>
        <a href="https://github.com/unlayer/react-email-editor/blob/master/docs/react-elements.md">
          Integration guide
        </a>
        {' · '}
        <a href="https://github.com/unlayer/elements">
          Explore Unlayer Elements
        </a>
        <p>
          Saving a design preserves visual edits; it does not rewrite the React
          source.
        </p>
      </footer>
    </main>
  );
}
