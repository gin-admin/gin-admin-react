import { AnyAction, Dispatch } from 'redux';
import { Badge, Button, Card, Col, Form, Input, Modal, Radio, Row, Table } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import PButton from '@/components/PermButton';
import { ConnectState, UserModelState } from '@/models/connect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RoleSelect from './RoleSelect';
import UserCard from './UserCard';
import { formatDate } from '../../utils/utils';
import styles from './UserList.less';

export interface UserListProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  user: UserModelState;
  loading: any;
}

export interface UserListState {
  selectedRowKeys: string[];
  selectedRows: any[];
}

@connect((state: ConnectState) => ({
  loading: state.loading.models.user,
  user: state.user,
}))
class UserList extends PureComponent<UserListProps, UserListState> {
  constructor(props: UserListProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'user/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = (item: any) => {
    this.dispatch({
      type: 'user/changeStatus',
      payload: { record_id: item.record_id, status: 2 },
    });
  };

  onItemEnableClick = (item: any) => {
    this.dispatch({
      type: 'user/changeStatus',
      payload: { record_id: item.record_id, status: 1 },
    });
  };

  onItemEditClick = (item: any) => {
    this.dispatch({
      type: 'user/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'user/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onDelOKClick(id: any) {
    this.dispatch({
      type: 'user/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  onItemDelClick = (item: any) => {
    Modal.confirm({
      title: `确定删除【用户数据：${item.user_name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.record_id),
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
      type: 'user/fetch',
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
      type: 'user/fetch',
      search: {},
      pagination: {},
    });
  };

  onSearchFormSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }

      const search = { ...values };
      if (search.roleIDs) {
        search.roleIDs = search.roleIDs.map((v: any) => v.role_id).join(',');
      }

      this.dispatch({
        type: 'user/fetch',
        search,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  onDataFormSubmit = (data: any) => {
    this.dispatch({
      type: 'user/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'user/changeFormVisible',
      payload: false,
    });
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderDataForm() {
    return <UserCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户名">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属角色">{getFieldDecorator('roleIDs')(<RoleSelect />)}</Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户状态">
              {getFieldDecorator('status', { initialValue: '0' })(
                <Radio.Group>
                  <Radio value="0">全部</Radio>
                  <Radio value="1">正常</Radio>
                  <Radio value="2">停用</Radio>
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
      user: { data },
    } = this.props;

    const { list, pagination } = data || {};
    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
      },
      {
        title: '真实姓名',
        dataIndex: 'real_name',
      },
      {
        title: '角色名称',
        dataIndex: 'roles',
        render: (val: any) => {
          if (!val || val.length === 0) {
            return <span>-</span>;
          }
          const names = [];
          for (let i = 0; i < val.length; i += 1) {
            names.push(val[i].name);
          }
          return <span>{names.join(' | ')}</span>;
        },
      },
      {
        title: '用户状态',
        dataIndex: 'status',
        render: (val: any) => {
          if (val === 1) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (val: any) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: any) => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <PageHeaderLayout title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  icon="edit"
                  onClick={() => this.onItemEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  icon="delete"
                  type="danger"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                selectedRows[0].status === 2 && (
                  <PButton
                    key="enable"
                    code="enable"
                    icon="check"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].status === 1 && (
                  <PButton
                    key="disable"
                    code="disable"
                    icon="stop"
                    type="danger"
                    onClick={() => this.onItemDisableClick(selectedRows[0])}
                  >
                    禁用
                  </PButton>
                ),
              ]}
            </div>
            <div>
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
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default Form.create<UserListProps>()(UserList);
