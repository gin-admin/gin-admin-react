import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';

@Form.create()
class AddDialog extends PureComponent {
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
        title="资源模板"
        width={400}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="资源名">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入资源名',
                },
              ],
            })(<Input placeholder="请输入资源名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="资源路由">
            {getFieldDecorator('router', {
              rules: [
                {
                  required: true,
                  message: '请输入资源路由',
                },
              ],
            })(<Input placeholder="请输入资源路由" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddDialog;
