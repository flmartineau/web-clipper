import React, { useLayoutEffect } from 'react';
import { Form, Modal, Select, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.less';
import { AccountPreference, UserPreferenceStore } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import RepositorySelect from '@/components/RepositorySelect';

type PageOwnProps = {
  servicesMeta: UserPreferenceStore['servicesMeta'];
  currentAccount: AccountPreference;
  visible: boolean;
  onCancel(): void;
  onEdit(oldId: string, userInfo: any, newId: string): void;
};
type PageProps = PageOwnProps & FormComponentProps;

const ModalTitle = () => (
  <div className={styles.modalTitle}>
    <FormattedMessage id="preference.accountList.addAccount" defaultMessage="Add Account" />
    <a href={'https://www.yuque.com/yuqueclipper/help_cn/bind_account'} target="_blank">
      <Icon type="question-circle" />
    </a>
  </div>
);

const Page: React.FC<PageProps> = ({
  visible,
  currentAccount,
  servicesMeta,
  form,
  form: { getFieldDecorator },
  onCancel,
  onEdit,
}) => {
  const {
    accountStatus: { verified, repositories, userInfo, id },
    verifyAccount,
    serviceForm,
    verifying,
  } = useVerifiedAccount({
    form,
    services: servicesMeta,
    initAccount: currentAccount,
  });

  useLayoutEffect(() => {
    verifyAccount(currentAccount);
  }, [currentAccount, verifyAccount]);

  const okText = verifying ? (
    <FormattedMessage id="preference.accountList.verifying" defaultMessage="Verifying" />
  ) : (
    <FormattedMessage id="preference.accountList.confirm" defaultMessage="Confirm" />
  );

  return (
    <Modal
      visible={visible}
      title={<ModalTitle />}
      okText={okText}
      okType="primary"
      okButtonProps={{
        loading: verifying,
        disabled: !verified,
      }}
      onCancel={onCancel}
      onOk={() => onEdit(currentAccount.id, userInfo, id!)}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: currentAccount.type,
          })(
            <Select disabled>
              {Object.values(servicesMeta).map(o => (
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
          {getFieldDecorator('defaultRepositoryId', {
            initialValue: currentAccount.defaultRepositoryId,
          })(
            <RepositorySelect
              disabled={!verified || verifying}
              loading={verifying}
              repositories={repositories}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Page;
