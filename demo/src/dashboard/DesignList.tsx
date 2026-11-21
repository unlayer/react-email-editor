import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  getDesigns,
  createDesign,
  deleteDesign,
  renameDesign,
  duplicateDesign,
  seedSampleIfEmpty,
  DesignData,
} from '../store';
import { useI18n, LanguageToggle } from '../i18n';
import sample from '../example/sample.json';

/* ─── Animations ─── */

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
`;

/* ─── Layout ─── */

const Page = styled.div`
  min-height: 100vh;
  background: #0b0b1a;
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,.15), transparent),
    radial-gradient(ellipse 60% 50% at 80% 100%, rgba(139,92,246,.1), transparent);
  padding: 0 24px 80px;
`;

const Header = styled.header`
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeInUp} .5s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 20px rgba(99,102,241,.35);
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
  box-shadow: 0 4px 20px rgba(99,102,241,.3);
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(99,102,241,.45);
  }
  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

/* ─── Grid ─── */

const Grid = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const Card = styled.div<{ $index: number }>`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all .25s ease;
  animation: ${fadeInUp} .45s ease-out both;
  animation-delay: ${(p) => p.$index * 60}ms;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(99,102,241,.06), rgba(139,92,246,.03));
    opacity: 0;
    transition: opacity .25s;
  }

  &:hover {
    border-color: rgba(99,102,241,.3);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,.3);

    &::before { opacity: 1; }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const CardIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(139,92,246,.1));
  border: 1px solid rgba(99,102,241,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDate = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const RenameInput = styled.input`
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(99,102,241,.5);
  border-radius: 8px;
  padding: 4px 8px;
  width: 100%;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139,92,246,.2);
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
  position: relative;
  z-index: 2;
  justify-content: flex-end;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid ${(p) => p.$danger ? 'rgba(239,68,68,.25)' : 'rgba(255,255,255,.1)'};
  border-radius: 8px;
  background: ${(p) => p.$danger ? 'rgba(239,68,68,.08)' : 'rgba(255,255,255,.04)'};
  color: ${(p) => p.$danger ? '#f87171' : '#94a3b8'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;

  &:hover {
    background: ${(p) => p.$danger ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.1)'};
    color: ${(p) => p.$danger ? '#fca5a5' : '#e2e8f0'};
    border-color: ${(p) => p.$danger ? 'rgba(239,68,68,.4)' : 'rgba(255,255,255,.2)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const OpenBadge = styled.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(99,102,241,.1);
  border: 1px solid rgba(99,102,241,.15);
  color: #818cf8;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .5px;
`;

/* ─── Empty state ─── */

const EmptyState = styled.div`
  max-width: 1120px;
  margin: 80px auto;
  text-align: center;
  animation: ${fadeInUp} .5s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 56px;
  margin-bottom: 20px;
  animation: ${pulse} 2.5s ease-in-out infinite;
`;

const EmptyTitle = styled.h2`
  font-size: 22px;
  color: #e2e8f0;
  margin: 0 0 8px;
`;

const EmptyText = styled.p`
  color: #64748b;
  font-size: 15px;
  margin: 0 0 28px;
`;

const StatsBar = styled.div`
  max-width: 1120px;
  margin: 0 auto 24px;
  display: flex;
  gap: 8px;
  align-items: center;
  animation: ${fadeInUp} .5s ease-out .1s both;
`;

const StatChip = styled.span`
  font-size: 13px;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.06);
`;

/* ─── Component ─── */

const DesignList = () => {
  const [designs, setDesigns] = useState<DesignData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, dateLocale } = useI18n();

  useEffect(() => {
    seedSampleIfEmpty(sample as any);
    setDesigns(getDesigns());
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const refresh = () => setDesigns(getDesigns());

  const handleNew = () => {
    const d = createDesign(t('common.newDesignName'));
    navigate(`/design/${d.id}`);
  };

  const handleOpen = (id: string) => {
    if (editingId) return;
    navigate(`/design/${id}`);
  };

  const startRename = (d: DesignData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(d.id);
    setEditName(d.name);
  };

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      renameDesign(editingId, editName.trim());
      refresh();
    }
    setEditingId(null);
  };

  const handleRenameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmRename();
    if (e.key === 'Escape') setEditingId(null);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateDesign(id, t('common.copySuffix'));
    refresh();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('dashboard.confirmDelete'))) {
      deleteDesign(id);
      refresh();
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(dateLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const sorted = [...designs].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Page>
      <Header>
        <Logo>
          <LogoIcon>✉️</LogoIcon>
          <div>
            <Title>{t('app.title')}</Title>
            <Subtitle>{t('app.subtitle')}</Subtitle>
          </div>
        </Logo>

        <HeaderActions>
          <LanguageToggle />
          <NewButton onClick={handleNew}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('dashboard.newDesign')}
          </NewButton>
        </HeaderActions>
      </Header>

      {sorted.length > 0 && (
        <StatsBar>
          <StatChip>{t('dashboard.designCount', sorted.length)}</StatChip>
        </StatsBar>
      )}

      {sorted.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>{t('dashboard.empty.title')}</EmptyTitle>
          <EmptyText>{t('dashboard.empty.text')}</EmptyText>
          <NewButton onClick={handleNew} style={{ margin: '0 auto' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('dashboard.empty.cta')}
          </NewButton>
        </EmptyState>
      ) : (
        <Grid>
          {sorted.map((d, i) => (
            <Card key={d.id} $index={i} onClick={() => handleOpen(d.id)}>
              {d.json ? (
                <OpenBadge>
                  <span>●</span> {t('dashboard.template')}
                </OpenBadge>
              ) : (
                <OpenBadge style={{ background: 'rgba(234,179,8,.1)', borderColor: 'rgba(234,179,8,.15)', color: '#facc15' }}>
                  <span>○</span> {t('dashboard.draft')}
                </OpenBadge>
              )}

              <CardHeader>
                <CardIcon>{d.json ? '📧' : '📝'}</CardIcon>
                <CardInfo>
                  {editingId === d.id ? (
                    <RenameInput
                      ref={inputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={confirmRename}
                      onKeyDown={handleRenameKey}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <CardName>{d.name}</CardName>
                  )}
                  <CardDate>
                    {t('dashboard.modifiedOn')} {formatDate(d.updatedAt)}
                  </CardDate>
                </CardInfo>
              </CardHeader>

              <CardActions>
                <ActionBtn onClick={(e) => startRename(d, e)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  {t('dashboard.rename')}
                </ActionBtn>
                <ActionBtn onClick={(e) => handleDuplicate(d.id, e)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {t('dashboard.duplicate')}
                </ActionBtn>
                <ActionBtn $danger onClick={(e) => handleDelete(d.id, e)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  {t('dashboard.delete')}
                </ActionBtn>
              </CardActions>
            </Card>
          ))}
        </Grid>
      )}
    </Page>
  );
};

export default DesignList;
