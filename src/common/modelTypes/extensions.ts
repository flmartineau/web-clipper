import { SerializedExtensionWithId } from '@web-clipper/extensions';

export interface ExtensionStore {
  disabledExtensions: string[];
  disabledAutomaticExtensions: string[];
  extensions: SerializedExtensionWithId[];
  defaultExtensionId?: string | null;
}

export const LOCAL_EXTENSIONS_EXTENSIONS_KEY = 'local.extensions.extensions';
export const LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY = 'local.extensions.disabled.extensions';
export const LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY =
  'local.extensions.disabled.automatic.extensions';
