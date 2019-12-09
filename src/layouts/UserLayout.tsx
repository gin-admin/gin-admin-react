import { ConnectState, GlobalModelState } from '@/models/connect';

import CopyRight from '@/components/CopyRight';
import GlobalFooter from '@/components/GlobalFooter';
import React from 'react';
import { connect } from 'dva';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

@connect(({ global }: ConnectState) => ({
  global,
}))
class UserLayout extends React.PureComponent<{ global: GlobalModelState }> {
  render() {
    const { children, global } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="" className={styles.logo} src={logo} />
            <span className={styles.title}>{global.title}</span>
          </div>
          <div className={styles.desc} />
        </div>
        {children}
        <GlobalFooter
          className={styles.footer}
          links={undefined}
          copyright={<CopyRight title={global.copyRight} />}
        />
      </div>
    );
  }
}

export default UserLayout;
