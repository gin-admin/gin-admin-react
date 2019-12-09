import { Form, Input } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const EditableContext = React.createContext(null);

interface EditableRowParam {
  form?: any;
  index?: any;
}
const EditableRow = (params: EditableRowParam) => {
  const { form, index, ...props } = params;
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};

export const EditableFormRow = Form.create()(EditableRow);

export interface EditableCellProps {
  record?: any;
  handleSave?: any;
  editable?: any;
  dataIndex?: any;
  title?: any;
  index?: any;
}
export class EditableCell extends PureComponent<EditableCellProps> {
  private form: any;

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error: any, values: any) => {
      if (error) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;

    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form: any) => {
              if (!form) {
                return undefined;
              }
              this.form = form;
              return (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `请输入${title}`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(
                    <Input
                      onBlur={() => {
                        this.save();
                      }}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
