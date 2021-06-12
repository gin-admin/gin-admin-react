import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Card, Radio, Modal, TreeSelect, Tooltip, InputNumber, Row, Col } from 'antd';
import MenuAction from './MenuAction';

@connect(({ menu }) => ({
  menu,
}))
class MenuCard extends PureComponent {
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
        formData.show_status = parseInt(formData.show_status, 10);
        formData.status = parseInt(formData.status, 10);
        formData.sequence = parseInt(formData.sequence, 10);
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

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      menu: { formVisible, formModalVisible, formTitle, formData, submitting, treeData },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    return (
      <Modal
        title={formTitle}
        width={1000}
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
          <Card bordered={false}>
            <Form
              ref={this.formRef}
              onFinishFailed={this.onFinishFailed}
              initialValues={{
                name: formData.name,
                parent_id: formData.parent_id,
                router: formData.router,
                icon: formData.icon,
                show_status: formData.show_status ? formData.show_status.toString() : '1',
                status: formData.status ? formData.status.toString() : '1',
                sequence: formData.sequence ? formData.sequence.toString() : '1000000',
                memo: formData.memo,
                actions: formData.actions,
              }}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="菜单名称"
                    name="name"
                    rules={[{ required: true, message: '请输入菜单名称' }]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="上级菜单" name="parent_id">
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toTreeSelect(treeData)}
                      placeholder="请选择"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="访问路径" name="router">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="菜单图标" name="icon">
                    <Row>
                      <Col span={20}>
                        <Input placeholder="请输入" />
                      </Col>
                      <Col span={4} style={{ textAlign: 'center' }}>
                        <Tooltip title="图标仅支持官方Icon图标(V3版本)">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="是否显示" name="show_status">
                    <Radio.Group>
                      <Radio value="1">显示</Radio>
                      <Radio value="2">隐藏</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="状态" name="status">
                    <Radio.Group>
                      <Radio value="1">启用</Radio>
                      <Radio value="2">禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="排序值"
                    name="sequence"
                    rules={[{ required: true, message: '请输入排序值' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="备注" name="memo">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card title="动作(按钮)管理" bordered={false}>
                    <Form.Item name="actions">
                      <MenuAction />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
      </Modal>
    );
  }
}

export default MenuCard;
