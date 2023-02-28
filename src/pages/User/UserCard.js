import React, { PureComponent } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Radio } from 'antd';
import { md5Hash } from '../../utils/utils';
import RoleSelect from './RoleSelect';

@connect(state => ({
  user: state.user,
}))
class UserCard extends PureComponent {
  formRef = React.createRef();

  onFinishFailed(err) {
    const { errorFields } = err;
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  onOKClick = () => {
    const { onSubmit } = this.props;

    this.formRef.current
      .validateFields()
      .then(values => {
        const formData = { ...values };
        formData.status = parseInt(formData.status, 10);
        if (formData.password && formData.password !== '') {
          formData.password = md5Hash(formData.password);
        }
        onSubmit(formData);
      })
      .catch(err => {
        console.log(' ----- === err :', err);
      });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      user: { formType, formTitle, formModalVisible, formVisible, formData, submitting },
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
        title={formTitle}
        width={600}
        visible={formModalVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        {formVisible && (
          <Form
            ref={this.formRef}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              user_name: formData.user_name,
              password: formData.password,
              real_name: formData.real_name,
              user_roles: formData.user_roles,
              status: formData.status ? formData.status.toString() : '1',
              email: formData.email,
              phone: formData.phone,
            }}
          >
            <Form.Item
              {...formItemLayout}
              label="用户名"
              name="user_name"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="登录密码"
              name="password"
              rules={[
                {
                  required: formType === 'A',
                  message: '请输入登录密码',
                },
              ]}
            >
              <Input
                type="password"
                placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
              />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="真实姓名"
              name="real_name"
              rules={[{ required: true, message: '请输入真实姓名' }]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="所属角色"
              name="user_roles"
              rules={[{ required: true, message: '请选择所属角色' }]}
            >
              <RoleSelect />
            </Form.Item>
            <Form.Item {...formItemLayout} label="用户状态" name="status">
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮箱" name="email">
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="手机号" name="phone">
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default UserCard;
