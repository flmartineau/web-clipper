import { ServiceMeta } from '@/common/backend';

export interface UserPreferenceStore {
  locale: string;
  showLineNumber: boolean;
  liveRendering: boolean;
  servicesMeta: {
    [type: string]: ServiceMeta;
  };
}

export interface ImageClipperData {
  dataUrl: string;
  width: number;
  height: number;
}

export type ClipperDataType = string | ImageClipperData;

export const LOCAL_USER_PREFERENCE_LOCALE_KEY = 'local.userPreference.locale';

/**
 * user Access Tiken
 */
export const LOCAL_ACCESS_TOKEN_LOCALE_KEY = 'local.access.token.locale';
