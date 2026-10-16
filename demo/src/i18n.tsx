import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import styled from 'styled-components';

/* ─── Types ─── */

export type Locale = 'fr' | 'en';

type TranslationValue = string | ((...args: any[]) => string);
type Translations = Record<string, TranslationValue>;

/* ─── Translations ─── */

const fr: Translations = {
  // Dashboard
  'app.title': 'Email Designer',
  'app.subtitle': 'Créez et gérez vos templates d\'emails',
  'dashboard.newDesign': 'Nouveau design',
  'dashboard.designCount': (n: number) => `${n} design${n > 1 ? 's' : ''}`,
  'dashboard.template': 'Template',
  'dashboard.draft': 'Brouillon',
  'dashboard.modifiedOn': 'Modifié le',
  'dashboard.rename': 'Renommer',
  'dashboard.duplicate': 'Dupliquer',
  'dashboard.delete': 'Supprimer',
  'dashboard.confirmDelete': 'Supprimer ce design ?',
  'dashboard.empty.title': 'Aucun design',
  'dashboard.empty.text': 'Créez votre premier template d\'email pour commencer.',
  'dashboard.empty.cta': 'Créer un design',

  // Editor
  'editor.back': 'Retour',
  'editor.preview': 'Aperçu',
  'editor.edit': 'Éditer',
  'editor.save': 'Sauvegarder',
  'editor.export': 'Exporter',
  'editor.saved': 'Design sauvegardé',
  'editor.clickToRename': 'Cliquez pour renommer',

  // Common
  'common.newDesignName': 'Nouveau design',
  'common.copySuffix': '(copie)',
};

const en: Translations = {
  // Dashboard
  'app.title': 'Email Designer',
  'app.subtitle': 'Create and manage your email templates',
  'dashboard.newDesign': 'New design',
  'dashboard.designCount': (n: number) => `${n} design${n > 1 ? 's' : ''}`,
  'dashboard.template': 'Template',
  'dashboard.draft': 'Draft',
  'dashboard.modifiedOn': 'Modified on',
  'dashboard.rename': 'Rename',
  'dashboard.duplicate': 'Duplicate',
  'dashboard.delete': 'Delete',
  'dashboard.confirmDelete': 'Delete this design?',
  'dashboard.empty.title': 'No designs yet',
  'dashboard.empty.text': 'Create your first email template to get started.',
  'dashboard.empty.cta': 'Create a design',

  // Editor
  'editor.back': 'Back',
  'editor.preview': 'Preview',
  'editor.edit': 'Edit',
  'editor.save': 'Save',
  'editor.export': 'Export',
  'editor.saved': 'Design saved',
  'editor.clickToRename': 'Click to rename',

  // Common
  'common.newDesignName': 'New design',
  'common.copySuffix': '(copy)',
};

const allTranslations: Record<Locale, Translations> = { fr, en };

/* ─── Context ─── */

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, ...args: any[]) => string;
  dateLocale: string;
}

const I18nContext = createContext<I18nContextType>(null!);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('app_locale');
    return saved === 'en' || saved === 'fr' ? saved : 'fr';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('app_locale', l);
  }, []);

  const t = useCallback(
    (key: string, ...args: any[]): string => {
      const val = allTranslations[locale][key];
      if (typeof val === 'function') return val(...args);
      if (typeof val === 'string') return val;
      return key; // fallback to key
    },
    [locale]
  );

  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dateLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

/* ─── Language Toggle Component ─── */

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  flex-shrink: 0;
`;

const LangBtn = styled.button<{ $active: boolean }>`
  padding: 5px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  background: ${(p) =>
    p.$active
      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      : 'transparent'};
  color: ${(p) => (p.$active ? '#fff' : '#64748b')};
  box-shadow: ${(p) =>
    p.$active ? '0 2px 8px rgba(99,102,241,.3)' : 'none'};

  &:hover {
    color: ${(p) => (p.$active ? '#fff' : '#e2e8f0')};
    background: ${(p) =>
      p.$active
        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        : 'rgba(255,255,255,.08)'};
  }
`;

export const LanguageToggle = () => {
  const { locale, setLocale } = useI18n();

  return (
    <ToggleWrapper>
      <LangBtn $active={locale === 'fr'} onClick={() => setLocale('fr')}>
        FR
      </LangBtn>
      <LangBtn $active={locale === 'en'} onClick={() => setLocale('en')}>
        EN
      </LangBtn>
    </ToggleWrapper>
  );
};
