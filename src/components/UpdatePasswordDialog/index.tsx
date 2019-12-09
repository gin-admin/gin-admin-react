import { AnyAction, Dispatch } from 'redux';
import { Form, Input, Modal, message } from 'antd';
import React, { PureComponent } from 'react';

import { md5Hash } from '@/utils/utils';
import { updatePwd } from '@/services/login';

// @ts-ignore
@Form.create()
class UpdatePasswordDialog extends PureComponent<{
  form?: any;
  onCancel: any;
  dispatch?: Dispatch<AnyAction>;
  visible: any;
}> {
  state = {
    submitting: false,
  };

  onOKClick = () => {
    const { form } = this.props;

    form.validateFieldsAndScroll((err: any, values: any) => {
      if (err) {
        return;
      }
      if (values.new_password !== values.confirm_new_password) {
        message.warning('新密码与确认新密码不一致！');
        return;
      }

      this.setState({ submitting: true });
      const formData = {
        old_password: md5Hash(values.old_password),
        new_password: md5Hash(values.new_password),
      };
      updatePwd(formData).then(res => {
        if (res.status === 'OK') {
          message.success('密码更新成功！');
          this.handleCancel();
        }
        this.setState({ submitting: false });
      });
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    // @ts-ignore
    dispatch(action);
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
    const {
      visible,
      form: { getFieldDecorator },
    } = this.props;
    const { submitting } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <Modal
        title="修改个人密码"
        width={450}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="旧密码">
            {getFieldDecorator('old_password', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码',
                },
              ],
            })(<Input type="password" placeholder="请输入旧密码" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="新密码">
            {getFieldDecorator('new_password', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码',
                },
              ],
            })(<Input type="password" placeholder="请输入新密码" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="确认新密码">
            {getFieldDecorator('confirm_new_password', {
              rules: [
                {
                  required: true,
                  message: '请输入确认新密码',
                },
              ],
            })(<Input type="password" placeholder="请输入确认新密码" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default UpdatePasswordDialog;
