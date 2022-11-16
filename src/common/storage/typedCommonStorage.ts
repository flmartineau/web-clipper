import { TypedCommonStorageInterface, CommonStorage, PreferenceStorage } from './interface';

const keysOfStorage = {
  accounts: 'accounts',
  defaultAccountId: 'defaultAccountId',
  defaultPluginId: 'defaultPluginId',
  showQuickResponseCode: 'showQuickResponseCode',
  liveRendering: 'liveRendering',
  showLineNumber: 'showLineNumber'
};

export class TypedCommonStorage implements TypedCommonStorageInterface {
  store: CommonStorage;

  constructor(store: CommonStorage) {
    this.store = store;
  }

  getPreference = async (): Promise<PreferenceStorage> => {
    const defaultPluginId = await this.getDefaultPluginId();
    const showLineNumber = await this.getShowLineNumber();
    const liveRendering = await this.getLiveRendering();

    return {
      defaultPluginId,
      showLineNumber,
      liveRendering,
    };
  };

  setDefaultPluginId = async (value: string | null) => {
    await this.store.set(keysOfStorage.defaultPluginId, value);
  };
  getDefaultPluginId = async () => {
    return this.store.get<string>(keysOfStorage.defaultPluginId);
  };

  setShowLineNumber = async (value: boolean) => {
    await this.store.set(keysOfStorage.showLineNumber, value);
  };
  getShowLineNumber = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.showLineNumber);
    return value !== false;
  };

  setLiveRendering = async (value: boolean) => {
    await this.store.set(keysOfStorage.liveRendering, value);
  };
  getLiveRendering = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.liveRendering);
    return value !== false;
  };
}
