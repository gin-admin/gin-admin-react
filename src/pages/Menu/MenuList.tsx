import { AnyAction, Dispatch } from 'redux';
import { Button, Card, Col, Form, Input, Layout, Modal, Radio, Row, Table, Tree } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import MenuCard from './MenuCard';
import { MenuModelState } from '@/models/menu';
import PButton from '@/components/PermButton';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './MenuList.less';

export interface MenuListProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  loading: any;
  menu: MenuModelState;
}

export interface MenuListState {
  selectedRowKeys: Array<any>;
  selectedRows: Array<any>;
  treeSelectedKeys: Array<any>;
}

@connect(({ menu }: ConnectState) => ({
  menu,
}))
class MenuList extends PureComponent<MenuListProps, MenuListState> {
  constructor(props: MenuListProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      treeSelectedKeys: [],
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'menu/fetchTree',
    });

    this.dispatch({
      type: 'menu/fetch',
      search: {},
      pagination: {},
    });
  }

  handleEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }

    const { record_id: recordID } = selectedRows[0];
    this.dispatch({
      type: 'menu/loadForm',
      payload: {
        type: 'E',
        id: recordID,
      },
    });
  };

  handleAddClick = () => {
    this.dispatch({
      type: 'menu/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }

    const { name, record_id: recordID } = selectedRows[0];
    Modal.confirm({
      title: `确定删除【菜单数据：${name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, recordID),
    });
  };

  handleTableSelectRow = (record: any, selected: any) => {
    let keys = new Array(0);
    let rows = new Array(0);
    if (selected) {
      keys = [record.record_id];
      rows = [record];
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = (pagination: any) => {
    this.dispatch({
      type: 'menu/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'menu/fetch',
      search: { parent_id: this.getParentID() },
      pagination: {},
    });
  };

  onSearchFormSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.dispatch({
        type: 'menu/fetch',
        search: {
          ...values,
          parent_id: this.getParentID(),
        },
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleFormSubmit = (data: any) => {
    this.dispatch({
      type: 'menu/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'menu/changeFormVisible',
      payload: false,
    });
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  getParentID = () => {
    const { treeSelectedKeys } = this.state;
    let parentID = '';
    if (treeSelectedKeys.length > 0) {
      [parentID] = treeSelectedKeys;
    }
    return parentID;
  };

  handleDelOKClick(id: any) {
    this.dispatch({
      type: 'menu/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <MenuCard onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />;
  }

  renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.record_id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode title={item.name} key={item.record_id} dataRef={item} />;
    });

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit} layout="inline">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="菜单名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="隐藏状态">
              {getFieldDecorator('hidden', {
                initialValue: '-1',
              })(
                <Radio.Group>
                  <Radio value="-1">全部</Radio>
                  <Radio value="0">显示</Radio>
                  <Radio value="1">隐藏</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      menu: { data, treeData, expandedKeys },
    } = this.props;

    const { list, pagination } = data || {};
    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '排序值',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '隐藏状态',
        dataIndex: 'hidden',
        width: 100,
        render: (val: any) => {
          let title = '显示';
          if (val === 1) {
            title = '隐藏';
          }
          return <span>{title}</span>;
        },
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        width: 100,
      },
      {
        title: '访问路由',
        dataIndex: 'router',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '菜单管理', href: '/system/menu' }];

    return (
      <PageHeaderLayout title="菜单管理" breadcrumbList={breadcrumbList}>
        <Layout>
          <Layout.Sider
            width={220}
            style={{
              background: '#fff',
              borderRight: '1px solid lightGray',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Tree
              expandedKeys={expandedKeys}
              onSelect={keys => {
                this.setState({
                  treeSelectedKeys: keys,
                });

                const {
                  menu: { search },
                } = this.props;

                const item = {
                  parentID: '',
                };

                if (keys.length > 0) {
                  [item.parentID] = keys;
                }

                this.dispatch({
                  type: 'menu/fetch',
                  search: { ...search, ...item },
                  pagination: {},
                });
              }}
              onExpand={keys => {
                this.dispatch({
                  type: 'menu/saveExpandedKeys',
                  payload: keys,
                });
              }}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </Layout.Sider>
          <Layout.Content>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                <div className={styles.tableListOperator}>
                  <PButton code="add" icon="plus" type="primary" onClick={this.handleAddClick}>
                    新建
                  </PButton>
                  {selectedRowKeys.length === 1 && [
                    <PButton key="edit" code="edit" icon="edit" onClick={this.handleEditClick}>
                      编辑
                    </PButton>,
                    <PButton
                      key="del"
                      code="del"
                      icon="delete"
                      type="danger"
                      onClick={this.handleDelClick}
                    >
                      删除
                    </PButton>,
                  ]}
                </div>
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onSelect: this.handleTableSelectRow,
                  }}
                  loading={loading}
                  rowKey={(record: any) => record.record_id}
                  dataSource={list}
                  columns={columns}
                  pagination={paginationProps}
                  onChange={this.onTableChange}
                  size="small"
                />
              </div>
            </Card>
          </Layout.Content>
        </Layout>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default Form.create<MenuListProps>()(MenuList);
