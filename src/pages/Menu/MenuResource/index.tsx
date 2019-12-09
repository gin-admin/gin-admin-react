import { Button, Popconfirm, Table } from 'antd';
import React, { PureComponent } from 'react';
import { EditableCell, EditableFormRow } from './EditableCell';

import AddDialog from './AddDialog';
import { newUUID } from '@/utils/utils';
import styles from './index.less';

export interface MenuActionProps {
  value?: any;
  onChange?: any;
}

export interface MenuActionState {
  dataSource: any;
  addVisible: boolean;
}

function fillKey(data: any) {
  if (!data) {
    return [];
  }
  return data.map((item: any) => {
    const nitem = { ...item };
    if (!nitem.key) {
      nitem.key = newUUID();
    }
    return nitem;
  });
}

export default class MenuAction extends PureComponent<MenuActionProps, MenuActionState> {
  private columns: (
    | { dataIndex: string; editable: boolean; width: string; title: string }
    | { dataIndex: string; editable: boolean; width: string; title: string }
    | { dataIndex: string; editable: boolean; width: string; title: string }
    | { dataIndex: string; editable: boolean; title: string }
    | {
        dataIndex: string;
        width: string;
        title: string;
        render: (_: any, record: any) => null | any;
      }
  )[];

  constructor(props: MenuActionProps) {
    super(props);

    this.columns = [
      {
        title: '资源编号',
        dataIndex: 'code',
        editable: true,
        width: '20%',
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        editable: true,
        width: '22%',
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        editable: true,
        width: '15%',
      },
      {
        title: '请求路径',
        dataIndex: 'path',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'key',
        width: '10%',
        render: (_: any, record: any) => {
          const { dataSource } = this.state;
          if (dataSource.length === 0) {
            return null;
          }
          return (
            <Popconfirm title="确定要删除该数据吗?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    this.state = {
      dataSource: fillKey(props.value),
      addVisible: false,
    };
  }

  static getDerivedStateFromProps(nextProps: any, state: any) {
    if ('value' in nextProps) {
      return { ...state, dataSource: fillKey(nextProps.value) };
    }
    return state;
  }

  handleAddCancel = () => {
    this.setState({ addVisible: false });
  };

  handleAddSubmit = (item: any) => {
    const tplData = [
      {
        code: 'query',
        name: `查询${item.name}`,
        method: 'GET',
        path: item.router,
      },
      {
        code: 'get',
        name: `精确查询${item.name}`,
        method: 'GET',
        path: `${item.router}/:id`,
      },
      {
        code: 'create',
        name: `创建${item.name}`,
        method: 'POST',
        path: item.router,
      },
      {
        code: 'update',
        name: `更新${item.name}`,
        method: 'PUT',
        path: `${item.router}/:id`,
      },
      {
        code: 'delete',
        name: `删除${item.name}`,
        method: 'DELETE',
        path: `${item.router}/:id`,
      },
    ];

    const newData = tplData.map(v => ({ key: v.code, ...v }));

    const { dataSource } = this.state;

    const data = [...dataSource];

    for (let i = 0; i < newData.length; i += 1) {
      let exists = false;
      for (let j = 0; j < dataSource.length; j += 1) {
        if (dataSource[j].key === newData[i].key) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        data.push(newData[i]);
      }
    }

    this.setState(
      {
        dataSource: data,
      },
      () => {
        this.triggerChange(data);
      },
    );

    this.handleAddCancel();
  };

  handleDelete = (key: any) => {
    const { dataSource } = this.state;
    const data = dataSource.filter((item: any) => item.key !== key);
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  handleAddTpl = () => {
    this.setState({ addVisible: true });
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const item = {
      key: newUUID(),
      code: '',
      name: '',
      method: '',
      path: '',
    };

    const data = [...dataSource, item];
    this.setState(
      {
        dataSource: data,
      },
      () => {
        this.triggerChange(data);
      },
    );
  };

  handleSave = (row: any) => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex((item: any) => row.key === item.key);
    const item = data[index];
    data.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  triggerChange = (data: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
    const { dataSource, addVisible } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button onClick={this.handleAdd} size="small" type="primary">
            新增
          </Button>
          <Button onClick={this.handleAddTpl} size="small" type="primary">
            使用模板
          </Button>
        </div>
        <Table
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <AddDialog
          visible={addVisible}
          onCancel={this.handleAddCancel}
          onSubmit={this.handleAddSubmit}
        />
      </div>
    );
  }
}
