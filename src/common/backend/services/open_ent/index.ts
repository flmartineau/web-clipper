import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';

export default (): ServiceMeta => {
    return {
        name: localeService.format({
            id: 'backend.services.open_ent.name',
            defaultMessage: 'Open ENT',
        }),
        icon: 'openENT',
        type: 'open_ent',
        service: Service,
        form: Form,
        homePage: 'http://localdev:8090/'
    };
};
