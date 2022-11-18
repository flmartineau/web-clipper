import React, { useEffect } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Modal, Form, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import { asyncAddAccount } from '@/actions/account';
import { isEqual } from 'lodash';
import RepositorySelect from '@/components/RepositorySelect';
import Container from 'typedi';
import { ITabService } from '@/service/common/tab';

interface PageQuery {
  access_token: string;
  type: string;
}

const mapStateToProps = ({
  userPreference: { servicesMeta },
}: GlobalStore) => {
  return {
    servicesMeta
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps & FormComponentProps;

function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

const Page: React.FC<PageProps> = props => {
  const query = parse(props.location.search.slice(1)) as PageQuery;
  const tabService = Container.get(ITabService);
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const {
    type,
    verifyAccount,
    accountStatus: { repositories, verified, userInfo, id },
    serviceForm,
    verifying,
    okText,
  } = useVerifiedAccount({
    form: props.form,
    services: props.servicesMeta,
    initAccount: query,
  });

  const memoizeQuery = useDeepCompareMemoize(query);

  useEffect(() => {
    verifyAccount(memoizeQuery);
  }, [verifyAccount, memoizeQuery]);

  return (
    <Modal
      visible
      okText={okText}
      onCancel={tabService.closeCurrent}
      okButtonProps={{
        disabled: verifying,
        loading: verifying,
      }}
      title={<FormattedMessage id="auth.modal.title" defaultMessage="Account Config" />}
      onOk={() => {
        console.log('ok');
        form.validateFields((error, values) => {
          if (error) {
            return;
          }
          const { defaultRepositoryId, ...info } = values;
          console.log("AUTH");
          console.log({
            id: id!,
            type,
            defaultRepositoryId,
            info,
            userInfo: userInfo!,
            callback: tabService.closeCurrent,
          });
          props.dispatch(
            asyncAddAccount.started({
              id: id!,
              type,
              defaultRepositoryId,
              info,
              userInfo: userInfo!,
              callback: tabService.closeCurrent,
            })
          );
        });
      }}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: query.type,
          })(
            <Select disabled>
              {Object.values(props.servicesMeta).map(o => (
                <Select.Option key={o.type}>{o.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {serviceForm}
        <Form.Item
          label={
            <FormattedMessage
              id="preference.accountList.defaultRepository"
              defaultMessage="Default Repository"
            />
          }
        >
          {getFieldDecorator('defaultRepositoryId')(
            <RepositorySelect
              disabled={!verified}
              loading={verifying}
              repositories={repositories}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(mapStateToProps)(Form.create<PageProps>()(Page));
