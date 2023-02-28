import React, { PureComponent } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Radio } from 'antd';

@connect(state => ({
  demo: state.demo,
}))
class DemoCard extends PureComponent {
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
      demo: { formTitle, formVisible, formModalVisible, formData, submitting },
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
              code: formData.code,
              name: formData.name,
              memo: formData.memo,
              status: formData.status ? formData.status.toString() : '1',
            }}
          >
            <Form.Item
              {...formItemLayout}
              label="编号"
              name="code"
              rules={[{ required: true, message: '编号必填' }]}
            >
              <Input placeholder="请输入编号" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="名称"
              name="name"
              rules={[{ required: true, message: '名称必填' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注" name="memo">
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="状态" name="status">
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default DemoCard;
