import type { EditorRef } from 'react-email-editor';

export type Editor = NonNullable<EditorRef['editor']>;
export type EmailDesign = Parameters<Editor['loadDesign']>[0];
export const STORAGE_KEY = 'react-email-editor:elements-design:v1';

// Sanity-check this demo's saved exports, not arbitrary imported designs.
export function readSavedDesign(storage: Storage): EmailDesign | null {
  const saved = storage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    const value = JSON.parse(saved);
    const design = value?.design;
    if (
      value?.version !== 1 ||
      typeof design?.schemaVersion !== 'number' ||
      !design.counters ||
      typeof design.counters !== 'object' ||
      !Array.isArray(design.body?.rows) ||
      !design.body.values ||
      typeof design.body.values !== 'object'
    ) {
      throw new Error('The saved design has an unsupported format.');
    }
    return design;
  } catch (error) {
    // Discard only invalid demo data; a storage read failure never reaches here.
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Storage may also block removal. The caller still loads the React template.
    }
    throw error;
  }
}

export function saveDesign(storage: Storage, design: EmailDesign): void {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, design }));
}
