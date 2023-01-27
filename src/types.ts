export type EditorOptions = {
  projectId?: number;
  tools?: object;
  appearance?: string;
  locale?: string;
};

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
  setMergeTags: (mergeTags: object) => void;
};

export type EditorRef = {
  saveDesign: (callback: Function) => void;
  exportHtml: (callback: Function) => void;
  setMergeTags: (mergeTags: Function) => void;
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
