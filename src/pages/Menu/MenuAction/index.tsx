import { Button, Popconfirm, Table } from 'antd';
import React, { PureComponent } from 'react';
import { EditableCell, EditableFormRow } from './EditableCell';

import { newUUID } from '@/utils/utils';
import styles from './index.less';

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

interface MenuActionProps {
  value?: any;
  onChange?: any;
}

interface MenuActionState {
  dataSource: any;
}

export default class MenuAction extends PureComponent<MenuActionProps, MenuActionState> {
  private columns: any;

  constructor(props: MenuActionProps) {
    super(props);

    this.state = {
      dataSource: fillKey(props.value),
    };

    this.columns = [
      {
        title: '动作编号',
        dataIndex: 'code',
        editable: true,
        width: '40%',
      },
      {
        title: '动作名称',
        dataIndex: 'name',
        editable: true,
        width: '45%',
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
  }

  static getDerivedStateFromProps(nextProps: any, state: any) {
    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: fillKey(nextProps.value),
      };
    }
    return state;
  }

  handleDelete = (key: any) => {
    const { dataSource } = this.state;
    const data = dataSource.filter((item: any) => item.key !== key);
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  handleAddTpl = () => {
    const tplData = [
      {
        code: 'add',
        name: '新增',
      },
      {
        code: 'edit',
        name: '编辑',
      },
      {
        code: 'del',
        name: '删除',
      },
      {
        code: 'query',
        name: '查询',
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
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const item = {
      key: newUUID(),
      code: '',
      name: '',
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
    const index = data.findIndex(item => row.key === item.key);
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

  render() {
    const { dataSource } = this.state;
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
          rowKey={(record: any) => record.key}
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
