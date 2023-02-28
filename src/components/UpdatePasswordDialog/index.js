import React, { PureComponent } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, message } from 'antd';
import { updatePwd } from '@/services/login';
import { md5Hash } from '../../utils/utils';

class UpdatePasswordDialog extends PureComponent {
  formRef = React.createRef();

  state = {
    submitting: false,
  };

  onOKClick = () => {
    this.formRef.current
      .validateFields()
      .then(values => {
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
      })
      .catch(err => {
        console.log(' ----- === err :', err);
        this.setState({ submitting: false });
      });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { visible } = this.props;

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
        <Form ref={this.formRef} initialValues={{}}>
          <Form.Item
            {...formItemLayout}
            label="旧密码"
            name="old_password"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input type="password" placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="新密码"
            name="new_password"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input type="password" placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="确认新密码"
            name="confirm_new_password"
            rules={[{ required: true, message: '请输入确认新密码' }]}
          >
            <Input type="password" placeholder="请输入确认新密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default UpdatePasswordDialog;
