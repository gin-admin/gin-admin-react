import { Checkbox, Col, Row } from 'antd';
import React, { PureComponent } from 'react';

export interface EditableCellProps {
  data: any;
  record: any;
  dataIndex: any;
  handleSave: any;
  menuData: any;
}

export default class EditableCell extends PureComponent<EditableCellProps> {
  findItem = () => {
    const { data, record } = this.props;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].menu_id === record.record_id) {
        return data[i];
      }
    }
    return null;
  };

  handleChange = (values: any) => {
    const { record, dataIndex, handleSave } = this.props;
    handleSave(record, dataIndex, values);
  };

  renderAction = (): any => {
    const { record } = this.props;
    if (!record.actions || record.actions.length === 0) {
      return null;
    }

    const item = this.findItem();
    return (
      <Checkbox.Group
        disabled={!item}
        value={item ? item.actions : []}
        onChange={this.handleChange}
      >
        {record.actions.map((v: any) => (
          <Col key={v.code}>
            <Checkbox value={v.code}>{v.name}</Checkbox>
          </Col>
        ))}
      </Checkbox.Group>
    );
  };

  renderResource = (): any => {
    const { record } = this.props;
    if (!record.resources || record.resources.length === 0) {
      return null;
    }

    const item = this.findItem();
    return (
      <Checkbox.Group
        disabled={!item}
        value={item ? item.resources : []}
        onChange={this.handleChange}
      >
        <Row>
          {record.resources.map((v: any) => (
            <Col key={v.code}>
              <Checkbox value={v.code}>{v.name}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    );
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
    const { dataIndex, record, menuData, handleSave, ...restProps } = this.props;

    return (
      <td {...restProps}>
        {dataIndex === 'actions' && this.renderAction()}
        {dataIndex === 'resources' && this.renderResource()}
        {!(dataIndex === 'actions' || dataIndex === 'resources') && restProps.children}
      </td>
    );
  }
}
