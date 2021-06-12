import React, { PureComponent } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Layout, Tree, Badge } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import { formatDate } from '@/utils/utils';
import MenuCard from './MenuCard';
import styles from './MenuList.less';

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class MenuList extends PureComponent {
  formRef = React.createRef();

  state = {
    selectedRowKeys: [],
    selectedRows: [],
    treeSelectedKeys: [],
  };

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

  onItemDisableClick = item => {
    this.dispatch({
      type: 'menu/changeStatus',
      payload: { id: item.id, status: 2 },
    });
  };

  onItemEnableClick = item => {
    this.dispatch({
      type: 'menu/changeStatus',
      payload: { id: item.id, status: 1 },
    });
  };

  handleEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'menu/loadForm',
      payload: {
        type: 'E',
        id: item.id,
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
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【菜单数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.id),
    });
  };

  handleTableSelectRow = (record, selected) => {
    const keys = [];
    const rows = [];
    if (selected) {
      keys.push(record.id);
      rows.push(record);
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = pagination => {
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
    this.formRef.current.resetFields();
    this.dispatch({
      type: 'menu/fetch',
      search: { parent_id: this.getParentID() },
      pagination: {},
    });
  };

  onSearchFormSubmit = values => {
    this.dispatch({
      type: 'menu/fetch',
      search: {
        ...values,
        parent_id: this.getParentID(),
      },
      pagination: {},
    });
    this.clearSelectRows();
  };

  handleFormSubmit = data => {
    this.dispatch({
      type: 'menu/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'menu/changeModalFormVisible',
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

  dispatch = action => {
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

  handleDelOKClick(id) {
    this.dispatch({
      type: 'menu/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <MenuCard onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />;
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode title={item.name} key={item.id} dataRef={item} />;
    });

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="queryValue" rules={[{ required: true, message: '请输入查询的值' }]}>
              <Input placeholder="请输入需要查询的内容" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden', paddingTop: 4 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      menu: {
        data: { list, pagination },
        treeData,
        expandedKeys,
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: 130,
        render: (val, row) => {
          if (row.show_status !== 1) {
            return <Badge status="default" text={val} />;
          }
          return <span>{val}</span>;
        },
      },
      {
        title: '排序值',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        width: 100,
      },
      {
        title: '访问路由',
        dataIndex: 'router',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        render: val => {
          if (val === 1) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'created_at',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '菜单管理', href: '/system/menu' }];

    return (
      <PageHeaderLayout title="菜单管理" breadcrumbList={breadcrumbList}>
        <Layout>
          <Layout.Sider
            width={180}
            style={{
              background: '#fff',
              borderRight: '1px solid lightGray',
              padding: 15,
              overflow: 'auto',
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
                  parentID: undefined,
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
                  <PButton code="add" type="primary" onClick={() => this.handleAddClick()}>
                    新建
                  </PButton>
                  {selectedRowKeys.length === 1 && [
                    <PButton key="edit" code="edit" onClick={() => this.handleEditClick()}>
                      编辑
                    </PButton>,
                    <PButton
                      key="del"
                      code="del"
                      type="danger"
                      onClick={() => this.handleDelClick()}
                    >
                      删除
                    </PButton>,
                    selectedRows[0].status === 2 && (
                      <PButton
                        key="enable"
                        code="enable"
                        onClick={() => this.onItemEnableClick(selectedRows[0])}
                      >
                        启用
                      </PButton>
                    ),
                    selectedRows[0].status === 1 && (
                      <PButton
                        key="disable"
                        code="disable"
                        type="danger"
                        onClick={() => this.onItemDisableClick(selectedRows[0])}
                      >
                        禁用
                      </PButton>
                    ),
                  ]}
                </div>
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onSelect: this.handleTableSelectRow,
                  }}
                  loading={loading}
                  rowKey={record => record.id}
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
export default MenuList;
