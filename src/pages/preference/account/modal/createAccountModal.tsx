import React from 'react';
import { Form, Modal, Select, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.less';
import { UserPreferenceStore } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import RepositorySelect from '@/components/RepositorySelect';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { ITabService } from '@/service/common/tab';

type PageOwnProps = {
  servicesMeta: UserPreferenceStore['servicesMeta'];
  visible: boolean;
  onCancel(): void;
  onAdd(id: string, userInfo: any): void;
};
type PageProps = PageOwnProps & FormComponentProps;

const ModalTitle = () => (
  <div className={styles.modalTitle}>
    <FormattedMessage id="preference.accountList.addAccount" defaultMessage="Add Account" />
  </div>
);

const Page: React.FC<PageProps> = ({
  servicesMeta,
  onCancel,
  form,
  form: { getFieldDecorator, getFieldValue },
  onAdd,
  visible,
}) => {
  const {
    type,
    accountStatus: { verified, repositories, userInfo, id },
    loadAccount,
    verifying,
    changeType,
    serviceForm,
    okText,
    oauthLink,
  } = useVerifiedAccount({ form, services: servicesMeta });

  const handleOk = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const type = getFieldValue('type');
    const permission = servicesMeta[type]?.permission;
    if (permission) {
      const result = await Container.get(IPermissionsService).request(permission);
      if (!result) {
        return;
      }
    }
    if (oauthLink) {
      console.log('oauthLink', oauthLink);
      Container.get(ITabService).create({
        url: oauthLink.props.href,
      });
      onCancel();
    } else if (verified && id) {
      console.log('verified et id');
      onAdd(id, userInfo);
    } else {
      console.log('loadAccount');
      loadAccount();
    }
  };

  return (
    <Modal
      visible={visible}
      okType="primary"
      onCancel={onCancel}
      okText={oauthLink ? oauthLink : okText}
      okButtonProps={{
        loading: verifying,
        disabled: verifying,
      }}
      onOk={handleOk}
      title={<ModalTitle />}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: type,
          })(
            <Select disabled={verified} onChange={changeType}>
              {Object.values(servicesMeta).map(o => (
                <Select.Option key={o.type}>{o.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {!oauthLink && serviceForm}
        {!oauthLink && (
          <React.Fragment>
            <Divider />
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
          </React.Fragment>
        )}
      </Form>
    </Modal>
  );
};

export default Page;
