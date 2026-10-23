import { CSSProperties } from 'react';

import type {
  AppearanceConfig,
  CallbackTypeMap,
  DisplayMode,
  ToolsConfig,
  UnlayerEditor,
  UnlayerEmbed,
  UnlayerOptions,
} from '@unlayer/types';

export interface EditorRef<
  TDisplayMode extends DisplayMode | undefined = 'email',
> {
  editor: UnlayerEditor<TDisplayMode> | null;
}

export interface EmailEditorProps<
  TDisplayMode extends DisplayMode | undefined = 'email',
> {
  editorId?: string | undefined;
  minHeight?: number | string | undefined;
  onLoad?(unlayer: UnlayerEditor<TDisplayMode>): void;
  onReady?(unlayer: UnlayerEditor<TDisplayMode>): void;
  options?: Omit<UnlayerOptions, 'displayMode'> & {
    displayMode?: TDisplayMode;
  };
  scriptUrl?: string | undefined;
  style?: CSSProperties | undefined;

  // Any prop beginning with `on` (other than onLoad/onReady above) is
  // forwarded to the Unlayer editor via `addEventListener`. The common
  // handlers are typed explicitly for autocomplete and payload typing; the
  // index signature keeps arbitrary forwarded events from erroring.
  onDesignLoad?: CallbackTypeMap<TDisplayMode>['onDesignLoad'];
  onDesignUpdated?: CallbackTypeMap<TDisplayMode>['design:updated'];
  onImageUpload?: CallbackTypeMap<TDisplayMode>['onImageUpload'];
  [event: `on${string}`]: ((...args: any[]) => void) | undefined;

  // redundant props -- already available in options
  /** @deprecated */
  appearance?: AppearanceConfig | undefined;
  /** @deprecated Use options.displayMode instead */
  displayMode?: TDisplayMode;
  /** @deprecated */
  locale?: string | undefined;
  /** @deprecated */
  projectId?: number | undefined;
  /** @deprecated */
  tools?: ToolsConfig | undefined;
}

declare global {
  const unlayer: UnlayerEmbed;

  interface Window {
    __unlayer_lastEditorId: number;
  }
}
