import {CompleteStatus, CreateDocumentRequest, Repository, UserInfo} from './../interface';

export interface OpenENTBackendServiceConfig {
    refresh_token: string;
    access_token?: string;
    login?: string;
    password?: string;
}

export interface OpenENTRefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface OpenENTUserInfoResponse {
    userId: string;
    username: string;
}

export interface OpenENTCreateDocumentRequest extends CreateDocumentRequest {
    id: string;
}


export interface OpenENTMagnetoBoards {
    id: string;
    title: string;
}

export interface DocumentService<T = any> {
    getId(): string;

    getRepositories(): Promise<Repository[]>;

    createDocument(request: CreateDocumentRequest): Promise<CompleteStatus | void>;

    getUserInfo(): Promise<UserInfo>;

    refreshToken?(info: T): Promise<T>;
}