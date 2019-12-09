import React from 'react';
import { Button } from 'antd';
import GetGlobalContext from '@/utils/context';

export default (param:any) => {
  const GlobalContext = GetGlobalContext();
  const { code, children, ...rest } = param;
  return (
    <GlobalContext.Consumer>
      {global=>{
        const {menuPaths} = global;
        if(menuPaths){
          const item = menuPaths[window.location.pathname];
          if(item&&item.actions){
            const {actions} = item;
            for (let i = 0; i < actions.length; i++) {
              if(actions[i].code === code){
                return <Button {...rest}>{children}</Button>
              }
            }
          }
        }
        return null;
      }}
    </GlobalContext.Consumer>
  );
};
