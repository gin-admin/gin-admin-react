import React, { PureComponent } from 'react';
import { Modal, Input, Card } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import MenuResource from '../MenuResource';

@Form.create()
class FormDialog extends PureComponent {
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSubmit({ ...values });
      }
    });
  };

  render() {
    const { visible, formData, form } = this.props;
    const { getFieldDecorator } = form;

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
        title="菜单动作(按钮)管理"
        width={650}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="动作编号">
            {getFieldDecorator('code', {
              initialValue: formData.code,
              rules: [
                {
                  required: true,
                  message: '请输入动作编号',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="动作名称">
            {getFieldDecorator('name', {
              initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入动作名称',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item>
            <Card title="资源管理(服务端接口映射)" bordered={false}>
              {getFieldDecorator('resources', {
                initialValue: formData.resources,
              })(<MenuResource />)}
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormDialog;
