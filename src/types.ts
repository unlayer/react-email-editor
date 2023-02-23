export type EditorOptions = {
  projectId?: number;
  appearance?: string;
  locale?: string;
  [name: string]: any;
};

export type MergeTag = Record<string, any>;

export type Editor = {
  destroy: () => void;
  id: number;
  ready: boolean;
  iframe: HTMLIFrameElement;
  addEventListener: (type: string, callback: Function) => void;
  registerCallback: (type: string, callback: Function) => void;
  loadDesign: (design: object) => void;
  saveDesign: (callback: Function) => void;
  exportHtml: (callback: Function) => void;
  showPreview: (device: string) => void;
  hidePreview: () => void;
  setMergeTags: (mergeTags: MergeTag[]) => void;
};

export type EditorRef = {
  saveDesign: (callback: Function) => void;
  exportHtml: (callback: Function) => void;
  setMergeTags: (mergeTags: MergeTag[]) => void;
  editor: Editor | null;
  loadDesign: (design: object) => void;
  registerCallback: (type: string, callback: Function) => void;
};

declare global {
  const unlayer: {
    createEditor: (
      options: {
        id: string;
        displayMode: string;
        source: { name: string; version: string };
      } & EditorOptions
    ) => Editor;
  };
}
