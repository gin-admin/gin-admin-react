import React, { PureComponent } from 'react';
import { Skeleton, Tabs } from 'antd';

import classNames from 'classnames';
import BreadcrumbView from './breadcrumb';
import styles from './index.less';

export interface PageHeaderProps {
  onTabChange?: any;
  title?: any;
  logo?: any;
  action?: any;
  content?: any;
  extraContent?: any;
  tabList?: any;
  className?: any;
  tabActiveKey?: any;
  tabDefaultActiveKey?: any;
  tabBarExtraContent?: any;
  loading?: any;
  wide?: any;
  hiddenBreadcrumb?: any;
  linkElement: any;
}

const { TabPane } = Tabs;

export default class PageHeader extends PureComponent<PageHeaderProps> {
  onChange = (key: any) => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      loading = false,
      wide = false,
      hiddenBreadcrumb = false,
    } = this.props;

    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = { defaultActiveKey: undefined, activeKey: undefined };
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    return (
      <div className={clsString}>
        <div className={wide ? styles.wide : ''}>
          <Skeleton
            loading={loading}
            title={false}
            active
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}
          >
            {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />}
            <div className={styles.detail}>
              {logo && <div className={styles.logo}>{logo}</div>}
              <div className={styles.main}>
                <div className={styles.row}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                  {action && <div className={styles.action}>{action}</div>}
                </div>
                <div className={styles.row}>
                  {content && <div className={styles.content}>{content}</div>}
                  {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                </div>
              </div>
            </div>
            {tabList && tabList.length ? (
              <Tabs
                className={styles.tabs}
                {...activeKeyProps}
                onChange={this.onChange}
                tabBarExtraContent={tabBarExtraContent}
              >
                {tabList.map((item: any) => (
                  <TabPane tab={item.tab} key={item.key} />
                ))}
              </Tabs>
            ) : null}
          </Skeleton>
        </div>
      </div>
    );
  }
}
