import { AnyAction, Dispatch } from 'redux';
import { Avatar, Dropdown, Icon, Layout, Menu, Spin } from 'antd';

import { ConnectState } from '@/models/connect';
import { ContainerQuery } from 'react-container-query';
import CopyRight from '@/components/CopyRight';
import DocumentTitle from 'react-document-title';
import { GlobalContext } from '@/utils/context';
import GlobalFooter from '@/components/GlobalFooter';
import { GlobalModelState } from '@/models/global';
import Link from 'umi/link';
import React from 'react';
import UpdatePasswordDialog from '@/components/UpdatePasswordDialog';
import classNames from 'classnames';
import { connect } from 'dva';
import logo from '../assets/logo.svg';
import styles from './SecurityLayout.less';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

export interface SecurityLayoutProps {
  global: GlobalModelState;
  dispatch: Dispatch<AnyAction>;
  location: any;
}

@connect(({ global }: ConnectState) => ({
  global,
}))
class SecurityLayout extends React.PureComponent<SecurityLayoutProps> {
  state = {
    updatePwdVisible: false,
  };

  componentDidMount(): void {
    const {
      location: { pathname },
    } = this.props;

    this.dispatch({
      type: 'global/fetchUser',
    });

    this.dispatch({
      type: 'global/fetchMenuTree',
      pathname,
    });
  }

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onCollapse = (collapsed: boolean) => {
    this.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  onMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      this.dispatch({
        type: 'login/logout',
      });
    } else if (key === 'updatepwd') {
      this.setState({ updatePwdVisible: true });
    }
  };

  onMenuOpenChange = (openKeys: any) => {
    const {
      global: { menuMap },
    } = this.props;

    if (openKeys.length > 1 && menuMap !== undefined) {
      const lastKey = openKeys[openKeys.length - 1];
      const lastItem = menuMap[lastKey];
      if (!lastItem) {
        this.dispatch({
          type: 'global/changeOpenKeys',
          payload: [],
        });
        return;
      }

      let isParent = false;
      for (let i = 0; i < openKeys.length - 1; i += 1) {
        const item = menuMap[openKeys[i]] || {};
        let path = item.record_id;
        if (item.parent_path !== '') {
          path = `${item.parent_path}/${path}`;
        }
        if (lastItem.parent_path === path) {
          isParent = true;
          break;
        }
      }

      if (!isParent) {
        this.dispatch({
          type: 'global/changeOpenKeys',
          payload: [lastKey],
        });
        return;
      }
    }

    this.dispatch({
      type: 'global/changeOpenKeys',
      payload: [...openKeys],
    });
  };

  onMenuSelectChange = (param: any) => {
    const { selectedKeys } = param;
    this.dispatch({
      type: 'global/changeSelectedKeys',
      payload: [...selectedKeys],
    });
  };

  onToggleClick = () => {
    const {
      global: { collapsed },
    } = this.props;
    this.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.onTriggerResizeEvent();
  };

  handleUpdatePwdCancel = () => {
    this.setState({ updatePwdVisible: false });
  };

  renderNavMenuItems(menusData: any) {
    if (!menusData) {
      return [];
    }

    return menusData.map((item: any) => {
      if (!item.name || item.hidden !== 0) {
        return null;
      }

      if (item.children && item.children.some((child: any) => child.name && child.hidden === 0)) {
        return (
          <SubMenu
            key={item.record_id}
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
          >
            {this.renderNavMenuItems(item.children)}
          </SubMenu>
        );
      }

      const { router } = item;
      const icon = item.icon && <Icon type={item.icon} />;
      const {
        location: { pathname },
      } = this.props;

      return (
        <Menu.Item key={item.record_id}>
          {router.startsWith('http') ? (
            <a href={router} target="_blank" rel="noopener noreferrer">
              {icon}
              <span>{item.name}</span>
            </a>
          ) : (
            <Link to={router} replace={router === pathname}>
              {icon}
              <span>{item.name}</span>
            </Link>
          )}
        </Menu.Item>
      );
    });
  }

  renderPageTitle(): string {
    const {
      location: { pathname },
      global: { menuPaths, title },
    } = this.props;

    let ptitle = title;
    if (menuPaths !== undefined) {
      const item = menuPaths[pathname];
      if (item) {
        ptitle = `${item.name} - ${title}`;
      }
    }

    if (ptitle === undefined) {
      return '';
    }
    return ptitle;
  }

  render() {
    const {
      children,
      global: { user, collapsed, openKeys, title, selectedKeys, menus, copyRight, menuPaths },
    } = this.props;

    const { updatePwdVisible } = this.state;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="updatepwd">
          <Icon type="lock" />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : { openKeys };
    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={this.onCollapse}
          width={256}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>{title}</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.onMenuOpenChange}
            onSelect={this.onMenuSelectChange}
            selectedKeys={selectedKeys}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.renderNavMenuItems(menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.onToggleClick}
            />
            <div className={styles.right}>
              {user && user.user_name ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} icon="user" />
                    {user.real_name !== ''
                      ? `${user.user_name}(${user.real_name})`
                      : user.user_name}
                  </span>
                </Dropdown>
              ) : (
                <Spin size="small" style={{ marginLeft: 8 }} />
              )}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <GlobalContext.Provider value={{ menuPaths }}>{children}</GlobalContext.Provider>
            </div>
            <GlobalFooter
              className={styles.footer}
              links={undefined}
              copyright={<CopyRight title={copyRight} />}
            />
          </Content>
        </Layout>
        <UpdatePasswordDialog visible={updatePwdVisible} onCancel={this.handleUpdatePwdCancel} />
      </Layout>
    );

    return (
      <DocumentTitle title={this.renderPageTitle()}>
        <ContainerQuery query={query}>
          {(params: any) => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default SecurityLayout;
