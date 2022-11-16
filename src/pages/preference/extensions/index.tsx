import React, { useState } from 'react';
import { DvaRouterProps } from '@/common/types';
import { Tabs } from 'antd';
import Locale from './locale';

const Page: React.FC<DvaRouterProps> = () => {
  const [activeKey, setActiveKey] = useState('Local');

  return (
    <Tabs activeKey={activeKey} onChange={setActiveKey} destroyInactiveTabPane>
      <Tabs.TabPane tab="Local" key="Local">
        <Locale />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Page;
