import React, { useEffect } from 'react';
import { DvaRouterProps } from '@/common/types';
import Container from 'typedi';
import { ITabService } from '@/service/common/tab';
import { useHistory } from 'dva';

const Page: React.FC<DvaRouterProps> = () => {
  const history = useHistory();

  useEffect(() => {
    if (history?.location?.search) {
      (async () => {
        const tabService = Container.get(ITabService);
        await tabService.closeCurrent();
      })();
    }
  }, [history]);

  return <div></div>;
};

export default Page;
