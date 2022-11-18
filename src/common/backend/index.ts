import {
  ServiceMeta,
  DocumentService,
} from './interface';
export * from './interface';

const serviceContext = require.context('./services', true, /index.ts$/);

const getServices = (): ServiceMeta[] => {
  return serviceContext.keys().map(key => {
    console.log(key);
    return serviceContext(key).default() as ServiceMeta;
  });
};

export function documentServiceFactory(type: string, info?: any) {
  console.log(type);
  const service = getServices().find(o => o.type === type);
  if (service) {
    const Service = service.service;
    return new Service(info);
  }
  throw new Error('unSupport type');
}

export { getServices };

export class BackendContext {
  private documentService?: DocumentService;

  setDocumentService(documentService: DocumentService) {
    this.documentService = documentService;
  }

  getDocumentService() {
    return this.documentService;
  }
}

export default new BackendContext();
