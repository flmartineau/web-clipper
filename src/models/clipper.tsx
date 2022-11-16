import { Container } from 'typedi';
import React from 'react';
import { IPermissionsService } from '@/service/common/permissions';
import { updateClipperHeader } from './../actions/clipper';
import { CompleteStatus } from 'common/backend/interface';
import { ExtensionType } from '@web-clipper/extensions';
import { CreateDocumentRequest, UnauthorizedError } from '@/common/backend/services/interface';
import { GlobalStore, ClipperStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import update from 'immutability-helper';
import {
  selectRepository,
  initTabInfo,
  asyncCreateDocument,
  asyncChangeAccount,
  changeData,
  watchActionChannel,
} from 'pageActions/clipper';
import backend, { documentServiceFactory } from 'common/backend';
import { unpackAccountPreference } from '@/common/account';
import { notification, Button } from 'antd';
import { routerRedux } from 'dva';
import { asyncUpdateAccount } from '@/actions/account';
import { channel } from 'redux-saga';

const defaultState: ClipperStore = {
  clipperHeaderForm: {
    title: '',
  },
  currentAccountId: '',
  repositories: [],
  clipperData: {},
};

const actionChannel = channel();

const model = new DvaModelBuilder(defaultState, 'clipper')
  .subscript(function startWatchActionChannel({ dispatch }) {
    dispatch(removeActionNamespace(watchActionChannel()));
  })
  .takeEvery(watchActionChannel, function*(_, { put, take }) {
    while (true) {
      const action = yield take(actionChannel);
      yield put(action);
    }
  })
  .takeEvery(asyncChangeAccount.started, function*(payload, { call, select, put }) {
    const selector = ({
      userPreference: { servicesMeta },
      account: { accounts },
    }: GlobalStore) => {
      return {
        accounts,
        servicesMeta,
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { accounts } = selectState;
    const currentAccount = accounts.find(o => o.id === payload.id);
    if (!currentAccount) {
      throw new Error('Load Account Error,Account not exist.');
    }
    const {
      id,
      account,
      account: { type, info },
      userInfo,
    } = unpackAccountPreference(currentAccount);
    const documentService = documentServiceFactory(type, info);
    const permissionsService = Container.get(IPermissionsService);
    if (selectState.servicesMeta[type]?.permission) {
      const hasPermissions = yield call(
        permissionsService.contains,
        selectState.servicesMeta[type]?.permission
      );
      if (!hasPermissions) {
        const key = `open${Date.now()}`;
        const close = () => {
          permissionsService.request(selectState.servicesMeta[type]?.permission!).then(re => {
            if (re) {
              actionChannel.put(asyncChangeAccount.started({ id }));
            }
          });
        };
        notification.error({
          key,
          placement: 'topRight',
          duration: 0,
          message: 'No Permission',
          btn: (
            <Button
              onClick={() => {
                notification.close(key);
                close();
              }}
              type="primary"
            >
              Grant
            </Button>
          ),
          onClose: () => close,
        });
        return;
      }
    }
    let repositories = [];
    try {
      repositories = yield call(documentService.getRepositories);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (documentService.refreshToken) {
          const newInfo = yield call(documentService.refreshToken, info);
          yield put(
            asyncUpdateAccount({
              id,
              account: {
                ...account,
                info: newInfo,
              },
              userInfo,
              newId: id,
              callback: () => {
                actionChannel.put(asyncChangeAccount.started({ id }));
              },
            })
          );
          return;
        }
        throw new Error('Filed to load Repositories,Unauthorized.');
      } else {
        throw error;
      }
    }
    backend.setDocumentService(documentService);
    yield put(
      asyncChangeAccount.done({
        params: payload,
        result: {
          repositories
        },
      })
    );
  })
  .takeLatest(asyncCreateDocument.started, function*({ pathname }, { put, call, select }) {
    const selector = ({
      clipper: { currentRepository, clipperHeaderForm, repositories, currentAccountId },
      account: { accounts },
      extension: { extensions },
    }: GlobalStore) => {
      const currentAccount = accounts.find(({ id }) => id === currentAccountId);
      let repositoryId;
      if (
        currentAccount &&
        repositories.some(({ id }) => id === currentAccount.defaultRepositoryId)
      ) {
        repositoryId = currentAccount.defaultRepositoryId;
      }
      if (currentRepository) {
        repositoryId = currentRepository.id;
      }
      const extension = extensions.find(o => o.router === pathname);
      return {
        repositoryId,
        extensions,
        clipperHeaderForm,
        extension,
        repositories,
      };
    };
    const {
      repositoryId,
      clipperHeaderForm,
      extension
    }: ReturnType<typeof selector> = yield select(selector);
    if (!repositoryId) {
      yield put(
        asyncCreateDocument.failed({
          params: { pathname },
          error: null,
        })
      );
      throw new Error('Must select repository.');
    }
    if (!extension) {
      return;
    }
    const data = yield select((g: GlobalStore) => g.clipper.clipperData[pathname]);
    let createDocumentRequest: CreateDocumentRequest | null = null;
    console.log(createDocumentRequest);
    console.log(data);


    if (extension.type === ExtensionType.Text) {
      createDocumentRequest = {
        repositoryId,
        content: data as string,
        ...clipperHeaderForm,
      };
    }
    if (extension.type === ExtensionType.Image) {
        createDocumentRequest = {
          repositoryId,
          content: data as string,
          ...clipperHeaderForm,
        };
    }
    if (!createDocumentRequest) {
      return;
    }
    const response: CompleteStatus = yield call(
      backend.getDocumentService()!.createDocument,
      createDocumentRequest
    );
    yield put(
      asyncCreateDocument.done({
        params: { pathname },
        result: {
          result: response,
          request: createDocumentRequest,
        },
      })
    );
    yield put(routerRedux.push('/complete'));
  })
  .case(
    asyncChangeAccount.done,
    (state, { params: { id }, result: { repositories } }) => {
      return update(state, {
        currentAccountId: {
          $set: id,
        },
        repositories: {
          $set: repositories,
        },
        currentRepository: {
          // eslint-disable-next-line no-undefined
          $set: undefined,
        }
      });
    }
  )
  .case(selectRepository, (state, { repositoryId }) => {
    const currentRepository = state.repositories.find(o => o.id === repositoryId);
    return {
      ...state,
      currentRepository,
    };
  })
  .case(initTabInfo, (state, { title, url }) => ({
    ...state,
    clipperHeaderForm: {
      ...state.clipperHeaderForm,
      title,
    },
    url,
  }))
  .case(asyncCreateDocument.started, state => ({
    ...state,
  }))
  .case(
    asyncCreateDocument.done,
    (state, { result: { result: completeStatus, request: createDocumentRequest } }) => ({
      ...state,
      completeStatus,
      createDocumentRequest,
    })
  )
  .case(updateClipperHeader, (state, clipperHeaderForm) => ({
    ...state,
    clipperHeaderForm,
  }))
  .case(changeData, (state, { data, pathName }) =>
    update(state, {
      clipperData: {
        [pathName]: {
          $set: data,
        },
      },
    })
  );

export default model.build();
