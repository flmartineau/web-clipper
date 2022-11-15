import * as React from 'react';
import styles from './index.less';
import Account from './account';
import ImageHosting from './imageHosting';
import Extensions from './extensions';
import { CenterContainer } from 'components/container';
import { router, connect } from 'dva';
import { Tabs, Icon, Badge, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import Base from './base';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import locale from '@/common/locales';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import { useObserver } from 'mobx-react';

const { Route } = router;

const TabPane = Tabs.TabPane;

const mapStateToProps = ({ account: { accounts } }: GlobalStore) => {
  return {
    accounts,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

const tabs = [
  {
    path: 'account',
    icon: <Icon type="user" />,
    title: <FormattedMessage id="preference.tab.account" defaultMessage="Account" />,
    component: Account,
  },
  {
    path: 'extensions',

    icon: <Icon type="tool" />,
    title: <FormattedMessage id="preference.tab.extensions" defaultMessage="Extension" />,
    component: Extensions,
  },
  {
    path: 'imageHost',
    icon: <Icon type="picture" />,

    title: <FormattedMessage id="preference.tab.imageHost" defaultMessage="ImageHost" />,
    component: ImageHosting,
  },
  {
    path: 'base',
    icon: <Icon type="setting" />,
    title: <FormattedMessage id="preference.tab.basic" defaultMessage="Basic" />,
    component: Base,
  }
];

type PageProps = DvaRouterProps & PageStateProps;

const Preference: React.FC<PageProps> = ({
  location: { pathname },
  history: { push },
  accounts,
}) => {
  const goHome = () => {
    if (accounts.length === 0) {
      message.error(
        locale.format({
          id: 'preference.bind.message',
          defaultMessage: 'You need to bind an account before you can use it.',
        })
      );
      return;
    }
    push('/');
  };

  const configService = Container.get(IConfigService);

  const isLatestVersion = useObserver(() => configService.isLatestVersion);

  return (
    <CenterContainer>
      <div className={styles.mainContent}>
        <div onClick={goHome} className={styles.closeIcon}>
          <Icon type="close" />
        </div>
        <div style={{ background: 'white', height: '100%' }}>
          <Tabs activeKey={pathname} tabPosition="left" style={{ height: '100%' }} onChange={push}>
            {tabs.map(tab => {
              const path = `/preference/${tab.path}`;
              let tabTitle = (
                <div style={{ width: 100 }}>
                  {tab.icon}
                  {tab.title}
                </div>
              );
              if (!isLatestVersion && tab.path === 'base') {
                tabTitle = <Badge dot>{tabTitle}</Badge>;
              }
              return (
                <TabPane tab={tabTitle} key={path} className={styles.tabPane}>
                  <Route exact path={path} component={tab.component} />
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
    </CenterContainer>
  );
};

export default connect(mapStateToProps)(Preference);
