import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Tooltip, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

export interface AddDialogProps extends FormComponentProps {
  onCancel:any,
  onSubmit:any,
  visible:any,
}

interface AddDialogState {

}

class AddDialog extends PureComponent<AddDialogProps,AddDialogState>{
  constructor(props:AddDialogProps){
    super(props)
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        const formData = { ...values };
        onSubmit(formData);
      }
    });
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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
        title="菜单资源模板"
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
          <Form.Item {...formItemLayout} label="资源名">
            <Row>
              <Col span={20}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入资源名',
                    },
                  ],
                })(<Input placeholder="请输入资源名" />)}
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title="例：用户数据">
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
                <Tooltip title="例：/api/v1/users">
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
