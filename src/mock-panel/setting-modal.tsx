import * as React from 'react';
import moment from 'moment';
import { Input, Modal, Form, Select, InputNumber, DatePicker } from 'antd';
import { Field } from '../mock-data';
import { FormComponentProps } from 'antd/es/form';
import './index.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface ModalProps extends FormComponentProps {
  value?: Field;
  onOK(value: Field): void;
  onCancel(): void;
}

class SettingModal extends React.Component<ModalProps> {
  onChange() {
    this.props.form.validateFields((err, fieldsValues) => {
      this.props.onOK(fieldsValues);
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const type: Field['type'] = getFieldValue('type');
    return (
      <Modal
        style={{ top: 10 }}
        title="设置"
        visible={true}
        onOk={this.onChange.bind(this)}
        onCancel={this.props.onCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="字段名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写字段名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="字段类型">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择字段类型' }],
            })(
              <Select allowClear={false}>
                <Option value="date">日期</Option>
                <Option value="enum">枚举</Option>
                <Option value="number">数字</Option>
              </Select>
            )}
          </Form.Item>
          {type === 'date' && (
            <>
              <Form.Item label="开始日期">
                {getFieldDecorator('start', {
                  getValueProps(value) {
                    return { value: moment(value) };
                  },
                  getValueFromEvent(e) {
                    return e.format('YYYY-MM-DD HH:mm:ss');
                  },
                  rules: [{ required: true, message: '开始日期必填' }],
                })(<DatePicker showTime />)}
              </Form.Item>
              <Form.Item label="结束日期">
                {getFieldDecorator('end', {
                  getValueProps(value) {
                    return { value: moment(value) };
                  },
                  getValueFromEvent(e) {
                    return e.format('YYYY-MM-DD HH:mm:ss');
                  },
                  rules: [{ required: true, message: '结束日期必填' }],
                })(<DatePicker showTime />)}
              </Form.Item>
              <Form.Item label="间隔" help="s:秒 m:分 h:小时 d:天 例如: 5m">
                {getFieldDecorator('step', {
                  initialValue: '1d',
                  rules: [{ required: true, message: '时间间隔必填' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="格式" help="y: 年 M:月 d:天 H:时 m:分 s:秒 例如: yyyy年MM月dd日">
                {getFieldDecorator('format', {
                  initialValue: 'yyyy/MM/dd',
                  rules: [{ required: true, message: '日期格式必填' }],
                })(<Input />)}
              </Form.Item>
            </>
          )}
          {type === 'enum' && (
            <>
              <Form.Item label="枚举值" help=",(英文)分开">
                {getFieldDecorator('values', {
                  getValueProps(value) {
                    return { value: value ? value.join(',') : '' };
                  },
                  getValueFromEvent(e) {
                    return e ? e.target.value.split(',') : [];
                  },
                  rules: [{ required: true, message: '枚举值不能为空' }],
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="重复方式">
                {getFieldDecorator('distribution', {
                  initialValue: 'cartesian',
                  rules: [{ required: true, message: '分布不能为空' }],
                })(
                  <Select>
                    <Option value="cartesian">组合</Option>
                    <Option value="random">随机</Option>
                    <Option value="sequential">循环</Option>
                  </Select>
                )}
              </Form.Item>
            </>
          )}
          {type === 'number' && (
            <>
              <Form.Item label="最小值">
                {getFieldDecorator('min', {
                  rules: [{ required: true, message: '最小值必填' }],
                  initialValue: 0,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="最大值">
                {getFieldDecorator('max', {
                  initialValue: 1000,
                  rules: [{ required: true, message: '最大值必填' }],
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="精度">
                {getFieldDecorator('decimals', {
                  initialValue: 0,
                  rules: [{ required: true, message: '数值精度必填' }],
                })(<InputNumber min={0} step={1} />)}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<ModalProps>({
  name: 'field',
  mapPropsToFields(props) {
    if (props.value) {
      const result: any = {
        name: Form.createFormField({
          value: props.value.name,
        }),
        type: Form.createFormField({
          value: props.value.type,
        }),
      };
      if (props.value.type === 'enum') {
        result.values = Form.createFormField({
          value: props.value.values,
        });
        Object.assign(result, {
          values: Form.createFormField({
            value: props.value.values,
          }),
          distribution: Form.createFormField({
            value: props.value.distribution,
          }),
        });
      }
      if (props.value.type === 'date') {
        Object.assign(result, {
          start: Form.createFormField({
            value: props.value.start,
          }),
          end: Form.createFormField({
            value: props.value.end,
          }),
          step: Form.createFormField({
            value: props.value.step,
          }),
          format: Form.createFormField({
            value: props.value.format,
          }),
        });
      }
      if (props.value.type === 'number') {
        Object.assign(result, {
          min: Form.createFormField({
            value: props.value.min,
          }),
          max: Form.createFormField({
            value: props.value.max,
          }),
          decimals: Form.createFormField({
            value: props.value.decimals,
          }),
        });
      }
      return result;
    }
  },
})(SettingModal);
