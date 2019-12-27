import { AnyAction, Dispatch } from 'redux';
import { Form, Input, Modal, Radio } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import RoleSelect from './RoleSelect';
import { md5Hash } from '../../utils/utils';

export interface UserCardProps extends FormComponentProps {
  dispatch?: Dispatch<AnyAction>;
  onSubmit: any;
  onCancel: any;
  user?: UserModelState;
}

export interface UserCardState {}

@connect(({ user }: ConnectState) => ({
  user,
}))
class UserCard extends PureComponent<UserCardProps, UserCardState> {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.status = parseInt(formData.status, 10);
        if (formData.password && formData.password !== '') {
          formData.password = md5Hash(formData.password);
        }
        onSubmit(formData);
      }
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
      onCancel,
      user,
      form: { getFieldDecorator },
    } = this.props;

    if (user === undefined) {
      return undefined;
    }

    const { formType, formTitle, formVisible, formData, submitting } = user;
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
          <Form.Item {...formItemLayout} label="用户名">
            {getFieldDecorator('user_name', {
              initialValue: formData.user_name,
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
              ],
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="登录密码">
            {getFieldDecorator('password', {
              initialValue: formData.password,
              rules: [
                {
                  required: formType === 'A',
                  message: '请输入登录密码',
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="真实姓名">
            {getFieldDecorator('real_name', {
              initialValue: formData.real_name,
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名',
                },
              ],
            })(<Input placeholder="请输入真实姓名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="所属角色">
            {getFieldDecorator('roles', {
              initialValue: formData.roles,
              rules: [
                {
                  required: true,
                  message: '请选择所属角色',
                },
              ],
            })(<RoleSelect />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="用户状态">
            {getFieldDecorator('status', {
              initialValue: formData.status ? formData.status.toString() : '1',
            })(
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: formData.email,
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: formData.phone,
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<UserCardProps>()(UserCard);
