export interface OneNoteBackendServiceConfig {
  refresh_token: string;
  access_token: string;
}

export interface OneNoteNotebooksResponse {
  value: {
    id: string;
    displayName: string;
    sections: {
      id: string;
      displayName: string;
    }[];
  }[];
}

export interface OpenENTUserInfoResponse {
  userId: string;
  username: string;
}

export interface OneNoteCreateDocumentResponse {
  id: string;
  links: {
    oneNoteClientUrl: {
      href: string;
    };
    oneNoteWebUrl: {
      href: string;
    };
  };
}

export interface OneNoteRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
