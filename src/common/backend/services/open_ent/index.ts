import { IConfigService } from '@/service/common/config';
import { Container } from 'typedi';
import config from '@/config';
import { ServiceMeta } from './../interface';
import Service from './service';
import localeService from '@/common/locales';
import { stringify } from 'qs';
import form from './form';

const oauthUrl = `http://localdev:8090/auth/oauth2/auth?${stringify({
  scope: 'userinfo',
  client_id: config.openENTClientId,
  state: Container.get(IConfigService).id,
  response_type: 'code',
  //response_mode: 'query',
  redirect_uri: config.openENTCallback,
})}`;

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.open_ent.name',
      defaultMessage: 'OpenENT',
    }),
    icon: 'OpenENT',
    type: 'open_ent',
    service: Service,
    oauthUrl,
    form: form,
    homePage: 'http://localdev:8090/',
    permission: {
      origins: ['https://graph.microsoft.com/*'],
    },
  };
};
