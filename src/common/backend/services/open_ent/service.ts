import {Repository, UnauthorizedError, UserInfo} from './../interface';
import { DocumentService } from './../../index';
import {
    OpenENTBackendServiceConfig,
    OpenENTCreateDocumentRequest,
    OpenENTUserInfoResponse,
    OpenENTMagnetoBoards, OpenENTRefreshTokenResponse
} from "common/backend/services/open_ent/interface";
import axios, {AxiosInstance} from "axios";
import md5 from "@web-clipper/shared/lib/md5";

//const converter = new showdown.Converter();

const BASE_URL = `http://localdev:8090`;

export default class OpenENTDocumentService implements DocumentService<OpenENTBackendServiceConfig> {
    private request: AxiosInstance;
    private config: OpenENTBackendServiceConfig;
    private repositories: Repository[];

    constructor({ access_token, refresh_token }: OpenENTBackendServiceConfig) {
        console.log("acc", access_token);
        this.config = { access_token, refresh_token };
        this.request = axios.create({
            baseURL: BASE_URL,
            headers: { Authorization: `bearer ${access_token}`},
            timeout: 100000,
            transformResponse: [data => JSON.parse(data)],
            withCredentials: true,
        });
        this.request.interceptors.response.use(
            r => r,
            error => {
                if (error.response && error.response.status === 401) {
                    const ere = new UnauthorizedError();
                    return Promise.reject(ere);
                }
                return Promise.reject(error);
            }
        );
        this.repositories = [];
    }

    getId = () => md5(this.config.access_token);

    getUserInfo = async (): Promise<UserInfo> => {
        const response = await this.request.get<{data:OpenENTUserInfoResponse}>('/auth/oauth2/userinfo');
        const { data } = response;
        return {
            name: data.data.username,
            description: '',
            avatar: '',
            homePage: 'http://localdev:8090/magneto',
        };
    };


    createDocument = async (data: OpenENTCreateDocumentRequest) => {
        console.log(data);
        // await this.request.post('/magneto/boards', {
        //     data: {
        //         parent_id: data.repositoryId,
        //         title: data.title,
        //         body: data.content,
        //         tags: data.tags.join(','),
        //     },
        // });
    };

    getRepositories = async () => {
        const folders = await this.request.get<OpenENTMagnetoBoards[]>('/magneto/boards');
        console.log(folders);
        this.repositories = [];
        // folders.forEach(folder => {
        //     repositories.push({
        //         id: folder.id,
        //         name: folder.title,
        //         groupId: folder.id,
        //         groupName: folder.title,
        //     });
        //     if (Array.isArray(folder.children)) {
        //         folder.children.forEach(subFolder => {
        //             repositories.push({
        //                 id: subFolder.id,
        //                 name: subFolder.title,
        //                 groupId: folder.id,
        //                 groupName: folder.title,
        //             });
        //         });
        //     }
        // });
        return this.repositories;
    };
    refreshToken = async ({ refresh_token, login, password }: OpenENTBackendServiceConfig) => {

        let url: string = 'http://localdev:8090/auth/oauth2/token';

        url += refresh_token ? `grant_type=refresh_token&refresh_token=${refresh_token}`
            : `grant_type=password&username=${login}&password=${password}`;


        const response = await this.request.post<OpenENTRefreshTokenResponse>(
            url
            // ,
            // stringify({
            //     grant_type: 'refresh_token',
            //     refresh_token: refresh_token,
            //     redirect_uri: config.openENTCallback,
            //     grant_type: 'refresh_token',
            //     client_id: config.oneNoteClientId,
            //     refresh_token,
            // })
        );
        return {
            //...rest,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
        };
    };
}
