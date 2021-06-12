import React, { PureComponent } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Input, Row, Col, Tooltip } from 'antd';
import '@ant-design/compatible/assets/index.css';

class TplDialog extends PureComponent {
  formRef = React.createRef();

  onFinishFailed(err) {
    const { errorFields } = err;
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { onSubmit } = this.props;

    this.formRef.current
      .validateFields()
      .then(values => {
        const formData = { ...values };
        onSubmit(formData);
      })
      .catch(err => {
        console.log(' ----- === err :', err);
      });
  };

  render() {
    const { visible } = this.props;
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
        title="快速创建模板"
        width={450}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form
          ref={this.formRef}
          initialValues={{
            name: '/api/v1/',
          }}
        >
          <Form.Item
            label="接口路径"
            {...formItemLayout}
            name="path"
            rules={[{ required: true, message: '请输入接口路径' }]}
          >
            <Row>
              <Col span={20}>
                <Input placeholder="请输入" />
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title="例：/api/v1/demos">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default TplDialog;
