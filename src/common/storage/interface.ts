export interface PreferenceStorage {
  defaultPluginId?: string | null;
  showLineNumber: boolean;
  liveRendering: boolean;
}

export interface CommonStorage {
  set(key: string, value: any): void | Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
}

export interface TypedCommonStorageInterface {
  getPreference(): Promise<PreferenceStorage>;

  setDefaultPluginId(id: string | null): Promise<void>;

  getDefaultPluginId(): Promise<string | undefined | null>;

  setShowLineNumber(value: boolean): Promise<void>;

  getShowLineNumber(): Promise<boolean>;

  setLiveRendering(value: boolean): Promise<void>;

  getLiveRendering(): Promise<boolean>;
}
