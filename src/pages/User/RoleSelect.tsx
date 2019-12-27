import React, { PureComponent } from 'react';

import { Select } from 'antd';
import { query } from '@/services/role';

function parseValue(value: any) {
  if (!value) {
    return [];
  }
  return value.map((v: any) => v.role_id);
}

export interface RoleSelectProps {
  value?: any;
  onChange?: any;
}

export interface RoleSelectState {
  value: any;
  data: any;
}

export default class RoleSelect extends PureComponent<RoleSelectProps, RoleSelectState> {
  constructor(props: RoleSelectProps) {
    super(props);

    this.state = {
      value: parseValue(props.value),
      data: [],
    };
  }

  componentDidMount() {
    query({ q: 'select' }).then(data => {
      this.setState({ data: data.list || [] });
    });
  }

  static getDerivedStateFromProps(nextProps: any, state: any) {
    if ('value' in nextProps) {
      return { ...state, value: parseValue(nextProps.value) };
    }
    return state;
  }

  handleChange = (value: any) => {
    this.setState({ value });
    this.triggerChange(value);
  };

  triggerChange = (data: any) => {
    const { onChange } = this.props;
    if (onChange) {
      const newData = data.map((v: any) => ({ role_id: v }));
      onChange(newData);
    }
  };

  render() {
    const { value, data } = this.state;

    return (
      <Select
        mode="tags"
        value={value}
        onChange={this.handleChange}
        placeholder="请选择角色"
        style={{ width: '100%' }}
      >
        {data.map((item: any) => (
          <Select.Option key={item.record_id} value={item.record_id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
