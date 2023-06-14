/// <reference types="react" />
/// <reference types="react-modal" />
/// <reference types="lodash" />
declare module "engine/config/offline" {
    export function enableOffline(): void;
    export function isOffline(): boolean;
}
declare module "engine/config/callbacks" {
    import { Handler } from 'mitt';
    export type CallbackData = any;
    export type CallbackDoneFn = (result: any) => void;
    export type CallbackFn = (data?: CallbackData, done?: CallbackDoneFn) => void;
    export type CallbackMap = {
        [name: string]: CallbackFn | undefined;
    };
    export function getCallback(type: string): CallbackFn;
    export function hasCallback(type: string): boolean;
    export function registerCallback(type: string, callback: CallbackFn | null | undefined): void;
    export function unregisterCallback(type: string): void;
    export function triggerCallback(type: string, ...args: [...any[], CallbackDoneFn]): void;
    export function onRegisterCallback(handler: Handler<{
        type: string;
        callback: CallbackFn;
    }>): {
        remove: () => void;
    };
    export function onTriggerCallback(handler: Handler<{
        type: string;
        callback: CallbackFn;
    }>): {
        remove: () => void;
    };
    export function onUnregisterCallback(handler: Handler<{
        type: string;
    }>): {
        remove: () => void;
    };
}
declare module "engine/config/fonts" {
    export interface Font {
        defaultFont?: boolean;
        type?: 'google' | string;
        label: string;
        value: string;
        url?: string;
        weights: number[];
    }
    export type FontList = Font[];
    export interface FontConfig {
        showDefaultFonts?: boolean;
        customFonts?: FontList;
    }
    export interface FontOptions {
        showCustomFonts?: boolean;
        showGlobalFont?: boolean;
    }
    export function loadFontConfig(newFontConfig?: FontConfig): void;
    export function disableBuiltinFonts(): void;
    export function setFonts(newFonts?: FontList): void;
    export function getFonts(options?: FontOptions): FontList;
    export function getCustomFontsCount(): number;
    export const defaultFontWeights: number[];
}
declare module "engine/config/intl" {
    import stockTranslations from '../translations';
    export type Locale = keyof typeof stockTranslations | 'en-US';
    export type TextDirection = 'ltr' | 'rtl';
    export const DEFAULT_LOCALE = "en-US";
    export const RTL_COUNTRIES: string[];
    export function getLocale(): Locale;
    export function setLocale(locale: Locale | null): void;
    export function getTextDirection(): TextDirection | undefined;
    export function getTextDirectionForLocale(locale: Locale): TextDirection | undefined;
    export function setTextDirection(textDirection: TextDirection | null): void;
    export function isRTL(locale: Locale): boolean;
}
declare module "editor/components/editors/types" {
    import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
    import { AppearanceConfig, Device, DisplayMode, Location, Variant } from '../../../state/types';
    export type LoadingState = 'not-loaded' | 'loading' | 'loaded';
    export type UpdatingState = 'updating' | undefined;
    export type DeletionState = 'deleting' | 'failed' | undefined;
    export interface EditorProps<Value, WidgetParams = object> {
        value: Value | undefined;
        defaultValue: Value | undefined;
        updateValue: (newValue: Value | undefined, data?: object, options?: {
            deviceOverride?: Device;
            skipFromUndoRedo?: boolean;
        }) => void;
        name: string;
        data?: object;
        widgetParams?: WidgetParams;
        displayMode: DisplayMode;
        label?: string;
        location: Location;
        values: {
            [key: string]: unknown;
            containerPadding?: string;
        };
        rootValues: {
            [key: string]: any;
            _override?: {
                [key: string]: any;
            };
        };
        appearance: AppearanceConfig;
        entitlements: {
            audit?: boolean;
            allowedDomains?: number;
            branding?: boolean;
            collaboration?: boolean;
            displayConditions?: boolean;
            customBlocks?: number;
            customCSS?: boolean;
            customFonts?: boolean;
            customJS?: boolean;
            customTools?: number;
            customTabs?: number;
            imageEditor?: boolean;
            userUploads?: boolean;
            stockImages?: boolean;
            uploadMaxSize?: number;
        };
        item: object;
        project: object;
        onImageClick?: (url: string) => void;
    }
    export type HeadArguments = [
        Record<string, any>,
        Record<string, any>,
        {
            displayMode: DisplayMode;
            embeddedValues: Record<string, any>;
            isViewer: boolean;
            variant: Variant;
        }
    ];
    export interface Head {
        css?: (...args: HeadArguments) => string | void;
        js?: (...args: HeadArguments) => string | void;
        tags?: (...args: HeadArguments) => string[] | void;
    }
    export type CollaborationFilter = 'only_yours' | 'resolved';
    export interface CollaborationFilterDetails {
        label?: string;
    }
    export type CollaborationType = 'feedback' | 'idea' | 'question' | 'urgent';
    export interface CollaborationTypeDetails {
        label?: string;
        icon: IconDefinition;
        color: string | undefined;
    }
    export type CollaborationThreadStatus = 'open' | 'resolved';
    export interface CollaborationThread {
        id: number;
        projectId: string | number;
        designId: string;
        user: CollaborationUser;
        itemId: string;
        type: CollaborationType;
        status: CollaborationThreadStatus | null | undefined;
        commentCount: number;
        firstComment: CollaborationThreadComment;
        createdAt: string;
        updatedAt: string;
    }
    export interface CollaborationThreadComment {
        id: number;
        threadId: CollaborationThread['id'];
        user: CollaborationUser;
        text: string;
        createdAt: string;
        updatedAt: string;
    }
    export interface CollaborationUser {
        id: string;
        name: string | undefined;
        avatar: string | undefined;
    }
    export type DeepPartial<T> = T extends object ? {
        [P in keyof T]?: DeepPartial<T[P]>;
    } : T;
}
declare module "state/types/index" {
    import { InputType } from 'reactstrap/lib/Input';
    import { CollaborationThread } from "editor/components/editors/types";
    export type DesignMode = 'live' | 'edit';
    export type DisplayMode = 'web' | 'email' | 'popup';
    export type Variant = 'amp' | null;
    export type Device = 'desktop' | 'mobile' | 'tablet';
    export type Theme = 'light' | 'dark';
    export interface MergeTag {
        name: string;
        value?: string;
        sample?: string;
        icon?: string;
        mergeTags?: MergeTags;
        rules?: {
            [key: string]: {
                name: string;
                before: string;
                after: string;
                sample?: boolean | Array<Record<string, string>>;
            };
        };
    }
    export interface MergeTags {
        [name: string]: MergeTag;
    }
    export type MergeTagsValues = Record<string, string | number | Record<string, boolean | Array<Record<string, string | number>>>>;
    export interface MergeTagsConfig {
        autocompleteTriggerChar?: string;
        sort?: boolean;
    }
    export interface DisplayCondition {
        type: string;
        label: string;
        description: string;
        before?: string;
        after?: string;
    }
    export type DisplayConditions = DisplayCondition[];
    export type SpecialLink = {
        name: string;
        href: string;
        target?: string;
        specialLinks?: undefined;
    } | {
        name: string;
        href?: undefined;
        target?: undefined;
        specialLinks: SpecialLinks;
    };
    export interface SpecialLinks {
        [name: string]: SpecialLink;
    }
    export type LinkTypeFieldOption = {
        value: string;
        label: string;
        enabled?: boolean;
    };
    export interface LinkTypeField {
        name: string;
        label: string;
        defaultValue?: string | LinkTypeFieldOption[] | undefined;
        enabled?: boolean;
        placeholderText?: string;
        inputType?: InputType;
        isClearable?: boolean;
        isCreatable?: boolean;
        isMulti?: boolean;
        limit?: number;
        limitMessage?: string;
        validationRegex?: string;
        options?: LinkTypeFieldOption[];
        onCreateOption?: (inputValue: string, meta: object, done: (newOption: LinkTypeFieldOption) => void) => void;
    }
    export interface LinkType {
        name: string;
        label: string;
        enabled?: boolean;
        attrs?: {
            href?: string;
            target?: string;
            onClick?: string | Function;
            class?: string;
            [key: string]: any;
        };
        fields?: LinkTypeField[];
    }
    export type LinkTypes = LinkType[];
    export type LinkTypesSharedConfig = Pick<LinkType, 'attrs' | 'fields'>;
    export interface CustomFont {
        label: string;
        value: string;
        url: string;
        weights?: number[];
    }
    export interface CustomFonts {
        [label: string]: CustomFont;
    }
    export type DesignTag = string;
    export interface DesignTags {
        [name: string]: DesignTag;
    }
    export interface DesignTagsConfig {
        delimiter: [string, string];
    }
    export type CustomCSS = string | string[] | undefined | null;
    export type CustomJS = string | string[] | undefined | null;
    export interface Translations {
        [name: string]: object;
    }
    export type Collection = 'bodies' | 'columns' | 'contents' | 'pages' | 'rows';
    export type Container = 'body' | 'row' | 'column' | 'content';
    export interface Location {
        collection: Collection;
        id: number | string;
    }
    export interface Selection {
        active: boolean;
        location: Location | null;
        parent: Location | null;
        threadId: CollaborationThread['id'] | null;
    }
    export interface Placeholder {
        active: boolean;
        layerGroup: Location | null;
        index: number | null;
    }
    export interface Tool {
        active: boolean;
        type: string | null;
        slug: string | null;
    }
    export interface Usage {
        displayMode?: DisplayMode;
        designMode?: DesignMode;
        customTools?: number;
        customTabs?: number;
        customBlocks?: number;
        customFonts?: number;
        linkTypes?: number;
        mergeTags?: number;
        specialLinks?: number;
        displayConditions?: number;
        designTags?: number;
        customCSS?: boolean;
        customJS?: boolean;
        fileStorage?: boolean;
    }
    export type ImageSource = 'unsplash' | 'pixabay' | 'pexel' | 'user';
    export interface Image {
        id: number;
        location: string;
        contentType: string;
        size: number;
        width: number | null;
        height: number | null;
        source: ImageSource | null;
        optimistic?: boolean;
    }
    export type ArrayItem<T> = T extends (infer I)[] ? I : T extends readonly (infer I)[] ? I : unknown;
    export type JSONTemplate = {
        counters: Record<string, number>;
        body: {
            id: string | undefined;
            rows: Array<{
                id: string;
                cells: number[];
                columns: Array<{
                    id: string;
                    contents: Array<{}>;
                    values: {};
                }>;
                values: {};
            }>;
            values: {};
        };
        schemaVersion?: number;
    };
    export type Fonts = {
        showDefaultFonts?: boolean;
        customFonts?: CustomFont[];
    };
    export type Icon = {
        name?: string;
        data?: string;
        url?: string;
    };
    export type AuditTool = {
        type: string;
        name?: string;
    };
    export type Rule = {
        id: string;
        icon: string | undefined;
        title: string;
        description: string;
        severity: 'ERROR' | 'WARNING';
    };
    export type Audit = {
        location?: Location;
        tool?: AuditTool;
    } & Rule;
    export type Validator = (info: {
        [id: string]: unknown;
        html?: string;
        defaultErrors?: Audit[];
    }) => Audit[];
    export type AsyncValidator = (...args: Parameters<Validator>) => Promise<ReturnType<Validator>>;
    type GroupedAuditError = {
        location: Location;
        tool?: AuditTool;
    };
    export type GroupedAudit = {
        [id: string]: {
            icon: string;
            title: string;
            description: string;
            errors: GroupedAuditError[];
        };
    };
    export type AuditApiResult = {
        status: 'FAIL' | 'PASS';
        errors: Audit[];
    };
    export type Tabs = {
        [tabName: string]: {
            enabled?: boolean;
            type?: string;
            position?: number;
            icon?: string;
            active?: boolean;
        };
    };
    export type SocialIcon = {
        name: string;
        url: string;
        imgUrl?: string;
    };
    export type SocialCustomIcon = {
        name: string;
        url: string;
        icons: {
            [key: string]: string;
        }[];
    };
    export type AppearanceConfig = {
        theme: Theme;
        panels: {
            tools: {
                dock: 'left' | 'right';
                collapsible: boolean;
                tabs: {
                    body: {
                        visible: boolean;
                    };
                };
            };
        };
        features: {
            preview: boolean;
        };
    };
    export interface ToolConfig {
        enabled?: boolean | undefined;
        position?: number | undefined;
        properties?: {
            [key: string]: {
                value: string;
            };
        } | {
            [key: string]: string;
        } | undefined;
    }
    export interface ToolsConfig {
        [key: string]: ToolConfig;
    }
    export type User = {
        id?: string | number;
        name?: string | null | undefined;
        avatar?: string | null | undefined;
        email?: string;
        signature?: string;
    };
}
declare module "embed/Config" {
    import { ValidationResult } from 'amphtml-validator';
    import { FontList } from "engine/config/fonts";
    import { TextDirection } from "engine/config/intl";
    import { AppearanceConfig, Audit, Device, DisplayConditions, DisplayMode, Fonts, JSONTemplate, LinkTypes, LinkTypesSharedConfig, MergeTags, MergeTagsConfig, MergeTagsValues, SpecialLinks, Tabs, ToolsConfig, User } from "state/types/index";
    export interface Config {
        id?: string;
        className?: string;
        version?: string;
        source?: {
            name: string;
            version: string;
        };
        offline?: boolean;
        render?: boolean;
        amp?: boolean;
        defaultDevice?: Device;
        devices?: Device[];
        designId?: string;
        designMode?: string;
        displayMode?: DisplayMode;
        env?: Record<'API_V1_BASE_URL' | 'API_V2_BASE_URL' | 'EVENTS_API_BASE_URL' | 'TOOLS_API_V1_BASE_URL' | 'TOOLS_CDN_BASE_URL', string | undefined>;
        projectId?: number | null;
        user?: User;
        templateId?: number;
        stockTemplateId?: string;
        loadTimeout?: number;
        safeHtml?: boolean | object;
        safeHTML?: boolean | object;
        options?: object;
        tools?: ToolsConfig;
        excludeTools?: string[];
        blocks?: object[];
        editor?: object;
        fonts?: Fonts;
        linkTypes?: LinkTypes;
        linkTypesSharedConfig?: LinkTypesSharedConfig;
        mergeTags?: MergeTags;
        displayConditions?: DisplayConditions;
        specialLinks?: SpecialLinks;
        designTags?: object;
        customCSS?: string | string[];
        customJS?: string | string[];
        locale?: string;
        textDirection?: TextDirection;
        translations?: object;
        appearance?: AppearanceConfig;
        features?: object;
        designTagsConfig?: object;
        mergeTagsConfig?: MergeTagsConfig;
        validator?: (info: {
            html: ExportHtmlResult;
            design: JSONTemplate;
            defaultErrors: Audit[];
        }) => Audit[];
        tabs?: Tabs;
    }
    export interface SaveDesignOptions {
    }
    export interface ExportHtmlOptions {
        amp?: boolean;
        cleanup?: boolean;
        textDirection?: TextDirection;
        isPreview?: boolean;
        live?: boolean;
        mergeTags?: MergeTagsValues;
        minify?: boolean;
        popupId?: string;
        title?: string;
        validateAmp?: boolean;
    }
    export interface ExportHtmlResult {
        html: string;
        amp: {
            enabled: boolean;
            format: 'AMP' | 'AMP4EMAIL';
            html: string | undefined;
            validation: ValidationResult;
        };
        chunks: ExportChunksResult;
        design: JSONTemplate;
    }
    export interface ExportPlainTextOptions extends Omit<ExportHtmlOptions, 'cleanup' | 'minify'> {
        ignorePreheader?: boolean;
    }
    export interface HtmlToPlainTextOptions {
        ignoreLinks?: boolean;
        ignoreImages?: boolean;
    }
    export interface ExportChunksResult {
        css: string;
        js: string;
        tags: string[];
        fonts: FontList;
        body: any;
    }
    export interface ExportPlainTextOptions {
        ignoreLinks?: boolean;
        ignoreImages?: boolean;
        ignorePreheader?: boolean;
        mergeTags?: Record<string, string>;
    }
    export interface ExportLiveHtmlOptions extends Omit<ExportHtmlOptions, 'live'> {
    }
    export interface ExportFromApiResult {
        [key: string]: any;
        url: string | null;
        error?: string;
    }
    interface BaseExportFromApiOptions {
        mergeTags?: Record<string, string>;
    }
    export interface ExportImageFromApiOptions extends BaseExportFromApiOptions {
        width?: number;
        height?: number;
        fullPage?: boolean;
        deviceScaleFactor?: number;
    }
    export interface ExportPdfFromApiOptions extends BaseExportFromApiOptions {
    }
    export interface ExportZipFromApiOptions extends BaseExportFromApiOptions {
    }
}
declare module "engine/utils/findDeep" {
    export function findDeep<T = any>(item: Record<string, T> | Array<T> | T, eq: ((item: T) => boolean) | unknown, { _path }?: {
        _path?: string[];
    }): string[][];
}
declare module "embed/Frame" {
    export type Message = object;
    export interface MessageData {
        action: string;
        callbackId: number;
        doneId: number;
        result: unknown | undefined;
        resultArgs: unknown[] | undefined;
    }
    export class Frame {
        id: number;
        ready: boolean;
        iframe: HTMLIFrameElement | undefined;
        messages: any[];
        callbackId: number;
        callbacks: {
            [key: number]: Function | undefined;
        };
        constructor(src: string);
        createIframe(src: string): HTMLIFrameElement;
        destroy: () => void;
        appendTo(el: Element): void;
        onWindowMessage: (event: MessageEvent<any>) => void;
        postMessage(action: string, message: Message): void;
        withMessage(action: string, message: Message | undefined, callback?: Function): void;
        preprocessMessage(message: Message): Message;
        scheduleMessage(message: Message): void;
        flushMessages(): void;
        handleMessage({ action, callbackId, doneId, result: _result, resultArgs: _resultArgs, }: MessageData): void;
        receiveMessage(event: any): void;
    }
    export const disableMultipleEditors: () => void;
    global {
        interface Window {
            __unlayer_lastFrameId: number;
            __unlayer_multipleEditors: boolean;
        }
    }
}
declare module "editor/components/common/Modal" {
    import React from 'react';
    import _Modal from 'react-modal';
    type Props = _Modal['props'] & {
        className?: string;
        children: React.ReactNode;
    };
    export function Modal(_props: Props): JSX.Element;
}
declare module "editor/components/common/ConditionalWrap" {
    import React from 'react';
    export interface ConditionalWrapProps {
        children: any;
        condition: boolean;
        wrap: (children: React.ReactElement<any>) => React.ReactNode;
    }
    export function ConditionalWrap(props: ConditionalWrapProps): any;
}
declare module "editor/components/common/Loader" {
    import React from 'react';
    export interface LoaderProps {
        children?: React.ReactNode;
        color?: boolean | string | ((props: {
            theme: any;
        }) => string);
        fadeIn?: boolean;
        loaded?: boolean;
        loadedClassName?: string;
        loadingClassName?: string;
        size?: 'small' | 'normal';
    }
    export function Loader(props: LoaderProps): JSX.Element;
}
declare module "editor/hooks/useDynamicRef" {
    export function useDynamicRef<T>(value: T): import("react").MutableRefObject<T>;
}
declare module "state/types/RootState" {
    import { StateType } from 'typesafe-actions';
    import reducer from '../reducer';
    export type RootState = StateType<typeof reducer>;
}
declare module "engine/config/env" {
    export const env: {
        API_V1_BASE_URL: string;
        API_V2_BASE_URL: string;
        EVENTS_API_BASE_URL: string;
        TOOLS_API_V1_BASE_URL: string;
        TOOLS_CDN_BASE_URL: string;
    };
    export function setIsTest(isTest: boolean): void;
    export function isTest(): boolean;
    global {
        interface Window {
            Cypress?: unknown;
        }
    }
}
declare module "editor/helpers/image" {
    export function fetchImage(imageURL: string, { proxyURL, retryWithoutProxy, }?: {
        proxyURL?: string;
        retryWithoutProxy?: boolean;
    }): Promise<Blob>;
    export function fetchImageViaProxy(imageURL: string, { proxyURL, retryWithoutProxy, }?: {
        proxyURL?: string;
        retryWithoutProxy?: boolean;
    }): Promise<Blob>;
    export function tryLoadImageFromStringOrBlob(imageSrcOrBlob: string | Blob): Promise<{
        image: {
            width: number;
            height: number;
            src: string;
        };
        imgElement: HTMLImageElement;
    }>;
    export function loadImageDimensions(imageSrcOrBlob: string | Blob): Promise<{
        width: number | undefined;
        height: number | undefined;
        error?: string;
    }>;
    export function imageHasTransparency(imageSrcOrBlob: string | Blob): Promise<boolean | null>;
}
declare module "editor/hooks/useImageUploader" {
    import { useStore } from 'react-redux';
    import { ImageSource } from '../../state/types';
    type Store = Pick<ReturnType<typeof useStore>, 'dispatch' | 'getState'>;
    export interface Params {
        maxSize?: number | null;
        onErrorChange?: (error: Error | null) => void;
        onImageSelect?: (image?: {
            url: string;
            width?: number;
            height?: number;
            size?: number;
        }) => void;
        onImageUpload?: (image: {
            url: string;
            width?: number;
            height?: number;
        }) => void;
        onUploadProgressChange?: (progress: number) => void;
        onUploadStatusChange?: (isUploading: boolean) => void;
        shouldReloadUserUploadsAfterUpload?: boolean;
        shouldTriggerReduxOptimisticUpdate?: boolean;
    }
    export function useImageUploader(params: Params): {
        error: Error;
        isUploading: boolean;
        startUploadFlow: (images: FileList | Array<File | Blob | string> | null, source: ImageSource) => void;
        setError: import("react").Dispatch<import("react").SetStateAction<Error>>;
        triggerSelectImageCallback: () => void;
        uploadProgress: number;
    };
    function triggerImageUploadCallback(images: FileList | Array<File | Blob | string>, source: ImageSource, { maxSize, onError, onImageUpload, project, setIsUploading, setUploadProgress, shouldReloadUserUploadsAfterUpload, shouldTriggerReduxOptimisticUpdate, store, userId, }: {
        maxSize?: Params['maxSize'];
        onError?: (error: Error | null) => void;
        onImageUpload?: Params['onImageUpload'];
        project: {
            id?: number;
        } | null;
        setIsUploading?: Params['onUploadStatusChange'];
        setUploadProgress?: Params['onUploadProgressChange'];
        shouldReloadUserUploadsAfterUpload?: Params['shouldReloadUserUploadsAfterUpload'];
        shouldTriggerReduxOptimisticUpdate?: Params['shouldTriggerReduxOptimisticUpdate'];
        store: Store;
        userId: string;
    }): Promise<void>;
    function uploadFiles(images: FileList | Array<File | Blob | string>, source: ImageSource, { maxSize, onError, onImageUpload, project, setIsUploading, setUploadProgress, shouldReloadUserUploadsAfterUpload, shouldTriggerReduxOptimisticUpdate, store, userId, }: {
        maxSize?: Params['maxSize'];
        onError?: (error: Error | null) => void;
        onImageUpload?: Params['onImageUpload'];
        project: {
            id?: number;
            storage?: boolean;
        } | null;
        setIsUploading?: Params['onUploadStatusChange'];
        setUploadProgress?: Params['onUploadProgressChange'];
        shouldReloadUserUploadsAfterUpload?: Params['shouldReloadUserUploadsAfterUpload'];
        shouldTriggerReduxOptimisticUpdate?: Params['shouldTriggerReduxOptimisticUpdate'];
        store: Store;
        userId: string;
    }): Promise<void>;
    export function startUploadFlow(images: FileList | Array<File | Blob | string> | null, source: ImageSource, params: Parameters<typeof triggerImageUploadCallback>[2] & Parameters<typeof uploadFiles>[2]): Promise<void>;
    export class ImageMaxSizeExceededError extends Error {
        maxSize: number;
        size: number;
        constructor({ size, maxSize }: {
            size: number;
            maxSize: number;
        }, message?: string, ...params: any[]);
    }
}
declare module "engine/utils/withHook" {
    import React from 'react';
    export function withHook<P extends object, C extends React.ComponentType<P>, HookName extends string, HookFn extends (props: P) => any>(Component: C, hookName: HookName, useHook: HookFn): React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P & Record<HookName, ReturnType<HookFn>>> & React.RefAttributes<unknown>>>;
}
declare module "editor/hooks/useForceRerender" {
    export function useForceRerender({ debounce, throttle, }?: {
        debounce?: boolean | number;
        throttle?: boolean | number;
    }): () => void;
}
declare module "editor/hooks/useConfig" {
    import React from 'react';
    export function useConfig(): any;
    export function withConfig<C extends React.ComponentType>(Component: C): React.MemoExoticComponent<React.ForwardRefExoticComponent<object & Record<"config", any> & React.RefAttributes<unknown>>>;
}
declare module "editor/components/common/ImageUploadButton" {
    import React from 'react';
    import { ButtonProps } from 'reactstrap';
    import { ImageSource } from '../../../state/types';
    export interface ImageUploadButtonInstance {
        clearError: () => void;
        openPicker: () => void;
        startUploadFlow: (images: FileList | Array<File | Blob | string> | null, source: ImageSource) => void;
    }
    export interface ImageUploadButtonProps {
        buttonProps?: ButtonProps;
        disableProgressIndicator?: boolean;
        maxSize?: number;
        onErrorChange?: (error: Error | null) => void;
        onImageSelect?: (image?: {
            url: string;
            width?: number;
            height?: number;
        }) => void;
        onImageUpload?: (image: {
            url: string;
            width?: number;
            height?: number;
        }) => void;
        onUploadProgressChange?: (progress: number) => void;
        onUploadStatusChange?: (isUploading: boolean) => void;
        shouldReloadUserUploadsAfterUpload?: boolean;
        shouldTriggerReduxOptimisticUpdate?: boolean;
        showError?: boolean;
    }
    export const ImageUploadButton: React.ForwardRefExoticComponent<ImageUploadButtonProps & React.RefAttributes<ImageUploadButtonInstance>>;
}
declare module "engine/tools/content/image" {
    export const DEFAULT_IMAGE_PLACEHOLDER = "https://cdn.tools.unlayer.com/image/placeholder.png";
}
declare module "engine/config/mergeTags" {
    import { MergeTags } from '../../state/types';
    export function getMergeTags(): MergeTags;
    export function getMergeTagsVersion(): number;
    export function setMergeTags(_mergeTags: MergeTags): void;
}
declare module "engine/utils/htmlEntities" {
    export function encodeHtmlEntities(str: string | undefined, { modes }?: {
        modes?: Array<keyof typeof replacers>;
    }): string;
    const replacers: {
        accents: (str: string | undefined) => string;
        all: (str: string | undefined) => string;
        others: (str: string | undefined) => string;
        tags: (str: string | undefined) => string;
    };
}
declare module "engine/utils/encodeMergeTag" {
    export function encodeMergeTag(str: string | undefined): string;
}
declare module "engine/utils/escapeHtml" {
    export function escapeHtml(str: string | undefined, { escapeAndOperator, // This was causing issues by changing & in links to &amp;
    escapeLT, escapeGT, escapeDoubleQuotes, escapeSingleQuotes, }?: {
        escapeAndOperator?: boolean;
        escapeLT?: boolean;
        escapeGT?: boolean;
        escapeDoubleQuotes?: boolean;
        escapeSingleQuotes?: boolean;
    }): string;
}
declare module "engine/utils/escapeRegexString" {
    export function escapeRegexString(str: string): string;
}
declare module "engine/utils/getNumberOrString" {
    export function getNumberOrString(str: string | number): string | number;
}
declare module "engine/utils/flattenMergeTags" {
    import { MergeTag, MergeTags, MergeTagsConfig } from '../../state/types';
    export type MergeTagWithMeta = MergeTag & {
        _meta: {
            key: string;
            tree: Array<Omit<MergeTag, 'mergeTags'> & {
                _meta?: Omit<MergeTagWithMeta['_meta'], 'tree'>;
            }>;
        };
    };
    function _flattenMergeTags(mergeTags: Array<MergeTag | MergeTagWithMeta> | MergeTags, mergeTagsConfig?: Pick<MergeTagsConfig, 'sort'>, _internal?: Pick<MergeTagWithMeta['_meta'], 'tree'>): Array<MergeTagWithMeta>;
    export const flattenMergeTags: typeof _flattenMergeTags & import("lodash").MemoizedFunction;
    export function getMergeTagLabel(mergeTag: MergeTagWithMeta['_meta']['tree'][0] | undefined): string;
    export function getMergeTagFlatLabel(mergeTag: MergeTagWithMeta | undefined): string;
}
declare module "engine/utils/testBrowserFeatures" {
    export function supportsRegexLookAheadLookBehind(): boolean;
    export function replaceWithLookBehind(str: string, lookbBehindStr: string, regex: RegExp, replacement: string): string;
}
declare module "engine/utils/applyMergeTagsToHtml" {
    import { MergeTags, MergeTagsValues } from '../../state/types';
    export function applyMergeTagsToHtml(html: string | undefined, { mergeTagsSchema, mergeTagsValues: _mergeTagsValues, _skipTags, _useRawValue, }: {
        mergeTagsSchema: MergeTags | undefined;
        mergeTagsValues: MergeTagsValues | undefined;
        _skipTags?: boolean;
        _useRawValue?: boolean;
    }): string;
}
declare module "engine/utils/generateMergeTagHtml" {
    import { Icon, MergeTag } from '../../state/types';
    export function generateMergeTagHtml(mergeTag: Pick<MergeTag, 'name' | 'value' | 'sample'> & {
        icon?: Icon | string;
    }): string;
}
declare module "engine/utils/applyMergeTagPreviewHtmlToText" {
    function _applyMergeTagPreviewHtmlToText(text: string | undefined, { type }?: {
        type?: 'smart' | 'raw';
    }): string;
    export const applyMergeTagPreviewHtmlToText: typeof _applyMergeTagPreviewHtmlToText & import("lodash").MemoizedFunction;
}
declare module "editor/components/common/Dropzone" {
    import React from 'react';
    import { DropzoneOptions } from 'react-dropzone';
    export interface DropzoneProps {
        children?: React.ReactNode;
        isUploading?: boolean;
        maxSize?: number;
        options?: DropzoneOptions;
        uploadProgress?: number;
        currentImage?: string;
        shouldRenderEffects?: boolean;
        onEffectsClick?: () => void;
        isEffectsButtonDisabled?: boolean;
        showImageInfo?: boolean;
        shouldRenderDropzone: boolean;
        isNotImageTool?: boolean;
    }
    export function Dropzone(props: DropzoneProps): JSX.Element;
}
declare module "editor/components/common/ImageUploadErrorMessage" {
    import { IntlShape } from 'react-intl';
    export interface ImageUploadErrorMessageProps {
        error: Error | boolean | null | undefined;
        maxSize?: number;
        onClick?: () => void;
    }
    export function getImageUploadErrorMessage(error: ImageUploadErrorMessageProps['error'], { maxSize, intl }: {
        maxSize: number;
        intl: IntlShape;
    }): any;
    export function ImageUploadErrorMessage(props: ImageUploadErrorMessageProps): JSX.Element;
}
declare module "engine/utils/position" {
    import { DisplayMode } from '../../state/types';
    export const ENABLE_BACKGROUND_POSITION_FOR_EMAILS = true;
    export type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    export function positionToMarginArray(position: Position | undefined): string[] | readonly [0, "auto", "auto", 0] | readonly [0, "auto", "auto", "auto"] | readonly [0, 0, "auto", "auto"] | readonly ["auto", "auto", "auto", 0] | readonly ["auto"] | readonly ["auto", 0, "auto", "auto"] | readonly ["auto", "auto", 0, 0] | readonly ["auto", "auto", 0, "auto"] | readonly ["auto", 0, 0, "auto"];
    export function positionToBackgroundPosition(position: Position | undefined): 'top left' | 'top center' | 'top right' | 'center left' | 'center center' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right' | 'auto auto';
    export function valuesToBackgroundPositionCSS(values: {
        position: Position | 'custom' | undefined;
        customPosition: [string, string] | undefined;
    }, { displayMode }: {
        displayMode: DisplayMode;
    }): string;
    export function positionToPercentages(position: Position | 'custom' | undefined): [x: string, y: string] | undefined;
    export function normalizePosition(position: 'top' | 'top-left' | 'top-center' | 'top-right' | 'center' | 'center-left' | 'center-center' | 'center-right' | 'center-top' | 'center-bottom' | 'bottom' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left' | 'left-top' | 'left-center' | 'left-bottom' | 'right' | 'right-top' | 'right-center' | 'right-bottom' | 'custom' | undefined): Position | undefined;
}
declare module "editor/components/editors/PositionEditor" {
    import { EditorProps } from "editor/components/editors/types";
    import { Position } from "engine/utils/position";
    export type PositionEditorValue = Position | 'custom';
    export type PositionEditorProps = EditorProps<PositionEditorValue, {
        positions?: Position[];
    }>;
    export function PositionEditor(props: PositionEditorProps): JSX.Element;
    export function PositionEditorBase(props: Pick<PositionEditorProps, 'updateValue' | 'value' | 'widgetParams'> & {
        className?: string;
        itemSize?: number;
        spacing?: number;
        valueLabelPosition?: 'left' | 'right' | 'none';
    }): JSX.Element;
}
declare module "editor/components/editors/common/Counter" {
    import React from 'react';
    export interface CounterProps {
        absoluteBaseValue?: number;
        buttonSize?: 'lg' | 'md' | 'sm' | undefined;
        children?: React.ReactNode;
        defaultUnit?: string;
        disabled?: boolean;
        maxValue?: number | null;
        minValue?: number | null;
        onChange: (value: number | string) => void;
        shouldRenderIncrementDecrementButtons?: boolean;
        step?: number;
        unitSupportedDisplayModes?: string[];
        units?: string[];
        value: number | string;
    }
    export default function Counter(props: CounterProps): JSX.Element;
}
declare module "engine/utils/sizeUtils" {
    import { DisplayMode } from '../../state/types';
    export const ENABLE_BACKGROUND_SIZE_FOR_EMAILS = false;
    export function normalizeFloat(n: number | string | undefined, decimalsPlace?: number): number;
    export function normalizeSize(size: number | string | undefined, { decimalsPlace }?: {
        decimalsPlace?: number;
    }): string;
    export function calculateExactSize(size: number | string, maxSize: number | undefined, options?: {
        decimalsPlace?: number;
        ifNumberConsiderAsPercentage?: boolean;
    }): number | undefined;
    export function valuesToBackgroundSizeCSS(values: {
        size: 'contain' | 'cover' | 'custom' | undefined;
        customSize: [string, string];
    }, { displayMode }: {
        displayMode: DisplayMode;
    }): string;
}
declare module "editor/components/editors/pixie/pixie.umd" {
    const _exports: {
        new (t: any): {
            readonly state: any;
            readonly version: string;
            readonly defaultConfig: {
                selector: string;
                textureSize: number;
                ui: {
                    visible: boolean;
                    mode: any;
                    forceOverlayModeOnMobile: boolean;
                    activeTheme: any;
                    themes: ({
                        name: any;
                        colors: {
                            "--be-foreground-base": string;
                            "--be-primary-light": string;
                            "--be-primary": string;
                            "--be-primary-dark": string;
                            "--be-on-primary": string;
                            "--be-error": string;
                            "--be-on-error": string;
                            "--be-background": string;
                            "--be-background-alt": string;
                            "--be-paper": string;
                            "--be-disabled-bg-opacity": string;
                            "--be-disabled-fg-opacity": string;
                            "--be-hover-opacity": string;
                            "--be-focus-opacity": string;
                            "--be-selected-opacity": string;
                            "--be-text-main-opacity": string;
                            "--be-text-muted-opacity": string;
                            "--be-divider-opacity": string;
                        };
                        isDark?: undefined;
                    } | {
                        name: any;
                        isDark: boolean;
                        colors: {
                            "--be-foreground-base": string;
                            "--be-primary-light": string;
                            "--be-primary": string;
                            "--be-primary-dark": string;
                            "--be-on-primary": string;
                            "--be-error": string;
                            "--be-on-error": string;
                            "--be-background": string;
                            "--be-background-alt": string;
                            "--be-paper": string;
                            "--be-disabled-bg-opacity": string;
                            "--be-disabled-fg-opacity": string;
                            "--be-hover-opacity": string;
                            "--be-focus-opacity": string;
                            "--be-selected-opacity": string;
                            "--be-text-main-opacity": string;
                            "--be-text-muted-opacity": string;
                            "--be-divider-opacity": string;
                        };
                    })[];
                    allowEditorClose: boolean;
                    menubar: {
                        items: ({
                            type: string;
                            align: string;
                            desktopOnly?: undefined;
                            icon?: undefined;
                            action?: undefined;
                            label?: undefined;
                        } | {
                            type: string;
                            align: string;
                            desktopOnly: boolean;
                            icon?: undefined;
                            action?: undefined;
                            label?: undefined;
                        } | {
                            type: string;
                            icon: any;
                            align: string;
                            desktopOnly: boolean;
                            action: (e: any) => void;
                            label?: undefined;
                        } | {
                            type: string;
                            icon: any;
                            label: {
                                id: string;
                                defaultMessage: {
                                    type: number;
                                    value: string;
                                }[];
                            };
                            align: string;
                            action: (e: any) => void;
                            desktopOnly?: undefined;
                        })[];
                    };
                    nav: {
                        position: any;
                        items: {
                            name: any;
                            icon: any;
                            action: any;
                        }[];
                    };
                    openImageDialog: {
                        show: boolean;
                        sampleImages: {
                            url: string;
                            thumbnail: string;
                        }[];
                    };
                    colorPresets: {
                        items: string[];
                    };
                };
                objectDefaults: {
                    global: any;
                    sticker: {
                        fill: any;
                    };
                    text: {
                        textAlign: string;
                        underline: boolean;
                        linethrough: boolean;
                        fontStyle: string;
                        fontFamily: string;
                        fontWeight: string;
                        stroke: any;
                        fontSize: number;
                    };
                };
                tools: {
                    filter: {
                        items: string[];
                    };
                    zoom: {
                        allowUserZoom: boolean;
                        fitImageToScreen: boolean;
                    };
                    crop: {
                        allowCustomRatio: boolean;
                        defaultRatio: string;
                        presets: ({
                            ratio: string;
                            name: string;
                        } | {
                            ratio: string;
                            name?: undefined;
                        })[];
                    };
                    text: {
                        defaultText: string;
                        items: ({
                            family: string;
                            src: string;
                            descriptors?: undefined;
                        } | {
                            family: string;
                            src: string;
                            descriptors: {
                                weight: string;
                            };
                        })[];
                    };
                    draw: {
                        brushSizes: number[];
                        brushTypes: string[];
                    };
                    shapes: {
                        items: ({
                            name: string;
                            type: string;
                            options?: undefined;
                        } | {
                            name: string;
                            type: string;
                            options: {
                                lockUniScaling: boolean;
                                path?: undefined;
                                strokeWidth?: undefined;
                                stroke?: undefined;
                                padding?: undefined;
                            };
                        } | {
                            name: string;
                            type: string;
                            options: {
                                path: string;
                                lockUniScaling?: undefined;
                                strokeWidth?: undefined;
                                stroke?: undefined;
                                padding?: undefined;
                            };
                        } | {
                            name: string;
                            type: string;
                            options: {
                                path: string;
                                strokeWidth: number;
                                stroke: string;
                                padding: number;
                                lockUniScaling?: undefined;
                            };
                        })[];
                    };
                    stickers: {
                        items: ({
                            name: string;
                            list: string[];
                            type: string;
                            thumbnailUrl: string;
                            items?: undefined;
                            invertPreview?: undefined;
                        } | {
                            name: string;
                            items: number;
                            type: string;
                            thumbnailUrl: string;
                            list?: undefined;
                            invertPreview?: undefined;
                        } | {
                            name: string;
                            items: number;
                            type: string;
                            thumbnailUrl: string;
                            invertPreview: boolean;
                            list?: undefined;
                        })[];
                    };
                    import: {
                        validImgExtensions: string[];
                        fitOverlayToScreen: boolean;
                        openDroppedImageAsBackground: boolean;
                    };
                    export: {
                        defaultFormat: string;
                        defaultQuality: number;
                        defaultName: string;
                    };
                    frame: {
                        items: ({
                            name: string;
                            mode: string;
                            size: {
                                min: number;
                                max: number;
                                default: number;
                            };
                            display_name?: undefined;
                        } | {
                            name: string;
                            display_name: string;
                            mode: string;
                            size: {
                                min: number;
                                max: number;
                                default: number;
                            };
                        })[];
                    };
                };
            };
            open(t?: {}): void;
            close(): void;
            setConfig(t: any): void;
            uploadAndAddImage(): any;
            uploadAndReplaceMainImage(): any;
            uploadAndOpenStateFile(): any;
            newCanvas(t: any, r: any, n: any): any;
            getState(t: any): string;
            setState(t: any): any;
            setStateFromUrl(t: any): Promise<any>;
            openTool(t: any): void;
            applyChanges(): void;
            cancelChanges(): void;
            resetEditor(t: any): Promise<void>;
            togglePanel(t: any, r: any): void;
            on(t: any, r: any): void;
            isDirty(): any;
            get(t: any): any;
            notify(t: any): any;
        };
        init(t: any): Promise<any>;
    };
    export = _exports;
}
declare module "editor/components/editors/pixie/PixieImageEditor" {
    export default PixieImageEditor;
    class PixieImageEditor extends React.Component<any, any, any> {
        constructor(props: any);
        constructor(props: any, context: any);
        state: {
            loading: boolean;
            saving: boolean;
            errorMessage: string;
        };
        componentDidMount(): void;
        componentDidUpdate(prevProps: any): void;
        loadPixieEditor: () => Promise<void>;
        updateImage: () => Promise<void>;
        componentWillUnmount(): Promise<void>;
        render(): JSX.Element;
        b64toBlob: (b64Data: any, contentType: any, sliceSize: any) => Blob;
    }
    import React from "react";
}
declare module "editor/components/editors/BackgroundImageEditor" {
    import { EditorProps } from "editor/components/editors/types";
    import { Position } from "engine/utils/position";
    export type BackgroundImageEditorValue = {
        url: string | undefined;
        width: number | undefined;
        height: number | undefined;
        fullWidth: boolean | undefined;
        size: 'contain' | 'cover' | 'custom' | undefined;
        customSize: [string, string];
        repeat: 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat' | undefined;
        position: Position | 'custom' | undefined;
        customPosition: [string, string];
    };
    export type BackgroundImageProps = EditorProps<BackgroundImageEditorValue, {
        shouldRender?: false | {
            dropzone?: boolean;
            effects?: boolean;
            uploadButton?: boolean;
            url?: boolean;
            options?: false | {
                containerWidth?: boolean;
                size?: boolean;
                repeat?: boolean;
                position?: boolean;
            };
        };
    }>;
}
declare module "engine/options/bodies" {
    import { BackgroundImageEditorValue } from "editor/components/editors/BackgroundImageEditor";
    export type BodyValues = {
        backgroundColor: string;
        backgroundImage: BackgroundImageEditorValue;
        contentWidth: string;
        fontFamily: {
            label: string;
            value: string;
        };
        linkStyle: {
            body: boolean;
            linkColor: string;
            linkHoverColor: string;
            linkUnderline: boolean;
            linkHoverUnderline: boolean;
        };
        preheaderText: string;
    };
}
declare module "engine/utils/stringifyFunction" {
    export function stringifyFunction(fn: Function): string;
    export function stringifyFunctionsFromObject(obj: object): {};
}
declare module "engine/utils/normalizeLinkTypes" {
    import { LinkType, LinkTypes, LinkTypesSharedConfig } from '../../state/types';
    export function normalizeLinkTypeSharedConfig(linkType: LinkTypesSharedConfig | null | undefined): any;
    export function normalizeLinkType(linkType: LinkType): any;
    export function normalizeLinkTypes(linkTypes: LinkTypes): any[];
}
declare module "embed/Editor" {
    import { Frame } from "embed/Frame";
    import { Config, ExportFromApiResult, ExportHtmlOptions, ExportHtmlResult, ExportImageFromApiOptions, ExportLiveHtmlOptions, ExportPdfFromApiOptions, ExportPlainTextOptions, ExportZipFromApiOptions, SaveDesignOptions } from "embed/Config";
    import { Audit, Device, DisplayMode, LinkTypes, LinkTypesSharedConfig, Tabs, Validator } from '../state/types';
    import { BodyValues } from "engine/options/bodies";
    import { Locale, TextDirection } from "engine/config/intl";
    export class Editor {
        frame: Frame | null;
        constructor(config?: Config);
        init(config?: Config): void;
        destroy(): void;
        loadEditor(config: Config): void;
        renderEditor(config: Config): void;
        initEditor(config: Config): void;
        registerColumns(cells: number[]): void;
        registerCallback(type: string, callback: Function): void;
        unregisterCallback(type: string): void;
        registerProvider(type: string, callback: Function): void;
        unregisterProvider(type: string): void;
        reloadProvider(type: string): void;
        addEventListener(type: string, callback: Function): void;
        removeEventListener(type: string): void;
        setDesignId(id: string | null): void;
        setDesignMode(designMode: string): void;
        setDisplayMode(displayMode: DisplayMode): void;
        loadProject(projectId: number): void;
        loadUser(user: object): void;
        loadTemplate(templateId: number): void;
        loadStockTemplate(stockTemplateId: string): void;
        setLinkTypes(linkTypes: LinkTypes): void;
        setLinkTypesSharedConfig(linkTypesSharedConfig: LinkTypesSharedConfig | null): void;
        setMergeTags(mergeTags: object): void;
        setSpecialLinks(specialLinks: object): void;
        setDisplayConditions(displayConditions: object): void;
        setLocale(locale: Locale | null): void;
        setTextDirection(textDirection: TextDirection | null): void;
        setTranslations(translations: object): void;
        loadBlank(bodyValues?: object): void;
        loadDesign(design: object): void;
        saveDesign(callback: Function, options?: SaveDesignOptions): void;
        exportHtml(callback: (data: ExportHtmlResult) => void, options?: ExportHtmlOptions): void;
        exportLiveHtml(callback: Function, options?: ExportLiveHtmlOptions): void;
        exportPlainText(callback: (data: {
            text: string;
        }) => void, options?: ExportPlainTextOptions): void;
        exportImage(callback: (data: ExportFromApiResult) => void, options: ExportImageFromApiOptions): void;
        exportPdf(callback: (data: ExportFromApiResult) => void, options: ExportPdfFromApiOptions): void;
        exportZip(callback: (data: ExportFromApiResult) => void, options: ExportZipFromApiOptions): void;
        setAppearance(appearance: object): void;
        setBodyValues(bodyValues: Partial<BodyValues>, bodyId?: number): void;
        setDesignTagsConfig(designTagsConfig: object): void;
        setMergeTagsConfig(mergeTagsConfig: object): void;
        showPreview(device?: Device): void;
        hidePreview(): void;
        canUndo(callback: (result: boolean) => void): void;
        canRedo(callback: (result: boolean) => void): void;
        undo(): void;
        redo(): void;
        audit(callback: (data: {
            status: 'FAIL' | 'PASS';
            errors: Audit[];
        }) => void): void;
        setValidator(validator: Validator | null): void;
        setToolValidator(tool: string, validator: Validator | null): void;
        updateTabs(tabs: Tabs): void;
        clearValidators(): void;
        registerContainerExporter(): void;
        registerItemExporter(): void;
        registerTool(): void;
        registerPropertyEditor(): void;
        registerTab(): void;
        createPanel(): void;
        createViewer(): void;
        createWidget(): void;
    }
}
declare module "embed/index" {
    import { Editor } from "embed/Editor";
    import { Config } from "embed/Config";
    class Embed extends Editor {
        createEditor(config: Config): Editor;
    }
    const _default: Embed;
    export default _default;
}
