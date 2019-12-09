import { Button } from 'antd';
import { GlobalContext } from '@/utils/context';
import React from 'react';

export default (param: any) => {
  const { code, children, ...rest } = param;
  return (
    <GlobalContext.Consumer>
      {global => {
        const { menuPaths } = global;
        if (menuPaths) {
          const item = menuPaths[window.location.pathname];
          if (item && item.actions) {
            const { actions } = item;
            for (let i = 0; i < actions.length; i += 1) {
              if (actions[i].code === code) {
                return <Button {...rest}>{children}</Button>;
              }
            }
          }
        }
        return null;
      }}
    </GlobalContext.Consumer>
  );
};
