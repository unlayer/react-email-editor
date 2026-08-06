import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

import EmailEditor, { EditorRef, EmailEditorProps } from '../../../src'; // use react-email-editor instead
import { getDesign, updateDesignJson, renameDesign } from '../store';
import { useI18n, LanguageToggle } from '../i18n';
import { editorTranslations } from '../editorTranslations';

/* ─── Animations ─── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ─── */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  animation: ${fadeIn} .3s ease-out;
`;

const Bar = styled.div`
  background: #0f0f1f;
  border-bottom: 1px solid rgba(255,255,255,.08);
  color: #e2e8f0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 56px;
  gap: 12px;
  flex-shrink: 0;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
  font-family: inherit;

  &:hover {
    background: rgba(255,255,255,.1);
    color: #e2e8f0;
    border-color: rgba(255,255,255,.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NameSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const DesignName = styled.h1`
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background .2s;

  &:hover {
    background: rgba(255,255,255,.06);
  }
`;

const NameInput = styled.input`
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(99,102,241,.5);
  border-radius: 6px;
  padding: 4px 8px;
  outline: none;
  font-family: inherit;
  max-width: 300px;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139,92,246,.2);
  }
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: ${(p) => p.$primary ? 'none' : '1px solid rgba(255,255,255,.12)'};
  border-radius: 10px;
  background: ${(p) => p.$primary ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,.05)'};
  color: ${(p) => p.$primary ? '#fff' : '#94a3b8'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
  font-family: inherit;

  ${(p) => p.$primary && `
    box-shadow: 0 2px 12px rgba(99,102,241,.3);
  `}

  &:hover {
    transform: translateY(-1px);
    ${(p) => p.$primary
      ? 'box-shadow: 0 4px 20px rgba(99,102,241,.4);'
      : 'background: rgba(255,255,255,.1); color: #e2e8f0;'}
  }
  &:active {
    transform: translateY(0);
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const SavedToast = styled.div`
  position: fixed;
  top: 70px;
  right: 24px;
  background: #10b981;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  animation: ${slideDown} .3s ease-out;
  box-shadow: 0 4px 20px rgba(16,185,129,.3);
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ─── Component ─── */

const DesignEdit = () => {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [designName, setDesignName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const designRef = useRef(getDesign(designId || ''));
  const { t, locale } = useI18n();

  useEffect(() => {
    if (!designId) {
      navigate('/');
      return;
    }
    const d = getDesign(designId);
    if (!d) {
      navigate('/');
      return;
    }
    designRef.current = d;
    setDesignName(d.name);
  }, [designId, navigate]);

  useEffect(() => {
    if (isRenaming && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isRenaming]);

  const onLoad: EmailEditorProps['onLoad'] = useCallback(
    (unlayer) => {
      const d = designRef.current;
      if (d?.json) {
        unlayer.loadDesign(d.json);
      }
    },
    []
  );

  const onReady: EmailEditorProps['onReady'] = useCallback(() => {
    console.log('Editor ready');
  }, []);

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer || !designId) return;

    unlayer.saveDesign((design) => {
      updateDesignJson(designId, design);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    unlayer.exportHtml((data) => {
      const { html } = data;
      console.log('exportHtml', html);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${designName || 'email'}.html`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const togglePreview = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    if (preview) {
      unlayer.hidePreview();
      setPreview(false);
    } else {
      unlayer.showPreview('desktop');
      setPreview(true);
    }
  };

  const startRename = () => {
    setRenameValue(designName);
    setIsRenaming(true);
  };

  const confirmRename = () => {
    if (designId && renameValue.trim()) {
      renameDesign(designId, renameValue.trim());
      setDesignName(renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmRename();
    if (e.key === 'Escape') setIsRenaming(false);
  };

  const goBack = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (unlayer && designId) {
      unlayer.saveDesign((design) => {
        updateDesignJson(designId, design);
        navigate('/');
      });
    } else {
      navigate('/');
    }
  };

  // Map our locale to Unlayer's supported locale format
  const editorLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <Container>
      <Bar>
        <BackBtn onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t('editor.back')}
        </BackBtn>

        <NameSection>
          {isRenaming ? (
            <NameInput
              ref={nameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={confirmRename}
              onKeyDown={handleRenameKey}
            />
          ) : (
            <DesignName onClick={startRename} title={t('editor.clickToRename')}>
              {designName}
            </DesignName>
          )}
        </NameSection>

        <LanguageToggle />

        <ActionButton onClick={togglePreview}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {preview ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          {preview ? t('editor.edit') : t('editor.preview')}
        </ActionButton>

        <ActionButton $primary onClick={saveDesign}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {t('editor.save')}
        </ActionButton>

        <ActionButton onClick={exportHtml}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('editor.export')}
        </ActionButton>
      </Bar>

      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
        onReady={onReady}
        options={{
          version: 'latest',
          locale: editorLocale,
          translations: editorTranslations[locale] || {},
          appearance: {
            theme: 'modern_light',
          },
        }}
      />

      {showSaved && (
        <SavedToast>
          ✓ {t('editor.saved')}
        </SavedToast>
      )}
    </Container>
  );
};

export default DesignEdit;
