export interface DesignData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  json: any;
}

const STORAGE_KEY = 'email_designs';

export function getDesigns(): DesignData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDesigns(designs: DesignData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
}

export function getDesign(id: string): DesignData | undefined {
  return getDesigns().find((d) => d.id === id);
}

export function createDesign(name: string, json?: any): DesignData {
  const design: DesignData = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    json: json || null,
  };
  const designs = getDesigns();
  designs.push(design);
  saveDesigns(designs);
  return design;
}

export function updateDesignJson(id: string, json: any): void {
  const designs = getDesigns();
  const idx = designs.findIndex((d) => d.id === id);
  if (idx !== -1) {
    designs[idx].json = json;
    designs[idx].updatedAt = Date.now();
    saveDesigns(designs);
  }
}

export function renameDesign(id: string, name: string): void {
  const designs = getDesigns();
  const idx = designs.findIndex((d) => d.id === id);
  if (idx !== -1) {
    designs[idx].name = name;
    designs[idx].updatedAt = Date.now();
    saveDesigns(designs);
  }
}

export function deleteDesign(id: string): void {
  const designs = getDesigns().filter((d) => d.id !== id);
  saveDesigns(designs);
}

export function duplicateDesign(id: string, copySuffix: string = '(copie)'): DesignData | undefined {
  const original = getDesign(id);
  if (!original) return undefined;
  return createDesign(`${original.name} ${copySuffix}`, original.json);
}

export function seedSampleIfEmpty(sampleJson: any): void {
  if (getDesigns().length === 0) {
    createDesign('Template MacBook Pro', sampleJson);
  }
}
