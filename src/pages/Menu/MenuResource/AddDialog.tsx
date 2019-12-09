import { Col, Form, Icon, Input, Modal, Row, Tooltip } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';

export interface AddDialogProps extends FormComponentProps {
  onCancel: any;
  onSubmit: any;
  visible: any;
}

interface AddDialogState {}

class AddDialog extends PureComponent<AddDialogProps, AddDialogState> {
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const formData = { ...values };
        onSubmit(formData);
      }
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="使用资源模板"
        width={450}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="资源名称">
            <Row>
              <Col span={20}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入资源名称',
                    },
                  ],
                })(<Input placeholder="请输入资源名称" />)}
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title="服务端路由名称(例：用户数据)">
                  <Icon type="question-circle" />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...formItemLayout} label="资源路由">
            <Row>
              <Col span={20}>
                {getFieldDecorator('router', {
                  rules: [
                    {
                      required: true,
                      message: '请输入资源路由',
                    },
                  ],
                })(<Input placeholder="请输入资源路由" />)}
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title="服务端路由路径(例：/api/v1/users)">
                  <Icon type="question-circle" />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<AddDialogProps>()(AddDialog);
