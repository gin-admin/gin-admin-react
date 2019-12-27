import { AnyAction, Dispatch } from 'redux';
import { Card, Col, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import RoleMenu from './RoleMenu';

export interface RoleCardProps extends FormComponentProps {
  onSubmit?: any;
  onCancel?: any;
  dispatch?: Dispatch<AnyAction>;
  role?: any;
}

export interface RoleCardState {}

@connect(({ role }: ConnectState) => ({
  role,
}))
class RoleCard extends PureComponent<RoleCardProps, RoleCardState> {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      formData.sequence = parseInt(formData.sequence, 10);
      if (!formData.menus || formData.menus.length === 0) {
        message.warning('请选择菜单权限！');
        return;
      }
      onSubmit(formData);
    });
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(action);
    }
  };

  render() {
    const {
      role: { formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 18,
      },
    };

    return (
      <Modal
        title={formTitle}
        width={1000}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Row>
            <Col>
              <Form.Item {...formItemLayout} label="角色名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名称',
                    },
                  ],
                })(<Input placeholder="请输入角色名称" />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item {...formItemLayout} label="排序值">
                {getFieldDecorator('sequence', {
                  initialValue: formData.sequence ? formData.sequence.toString() : '1000000',
                  rules: [
                    {
                      required: true,
                      message: '请输入排序值',
                    },
                  ],
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('memo', {
                  initialValue: formData.memo,
                })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card title="选择菜单权限" bordered={false}>
                {getFieldDecorator('menus', {
                  initialValue: formData.menus,
                })(<RoleMenu />)}
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<RoleCardProps>()(RoleCard);
