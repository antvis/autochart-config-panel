import * as React from 'react';
import * as ReactDOM from 'react-dom';
import thumbnails from '@antv/thumbnails';
import './index.less';
import { CONFIG_MAP } from './configs';
import { Tabs, Table, Icon, Form, InputNumber, Button, Popconfirm, Tooltip } from 'antd';
import { mock, Field, getOptimalCount } from '../mock-data';
import SettingModal from './setting-modal';
import { parseSearch, uuid } from '../utils';
import './index.less';

const { id } = parseSearch<{ id: string }>();
const fields: Field[] = [
  { type: 'date', start: '2019-01-01', end: '2019-01-10', step: '1d', format: 'yyyy/MM/dd', name: 'date' },
  { type: 'enum', values: ['上海', '伦敦'], distribution: 'cartesian', name: 'city' },
  { type: 'number', name: 'count', min: 0, max: 1000, decimals: 0 },
];

const CHART_NAME_MAP = {
  line_chart: '折线图',
  area_chart: '面积图',
  bar_chart: '条形图',
  grouped_bar_chart: '分组条形图',
  stacked_bar_chart: '堆叠条形图',
  percent_stacked_bar_chart: '百分比堆叠条形图',
  column_chart: '柱状图',
  grouped_column_chart: '分组柱状图',
  stacked_column_chart: '堆叠柱状图',
  percent_stacked_column_chart: '百分比堆叠柱状图',
  stacked_area_chart: '堆叠面积图',
  pie_chart: '饼图',
  donut_chart: '环图',
  radar_chart: '雷达图',
  scatter_plot: '散点图',
  bubble_chart: '气泡图',
  histogram: '直方图',
  heatmap: '热力图',
};

class App extends React.Component {
  state = {
    tab: 'chart',
    type: undefined,
    fields,
    count: 20,
    data: mock(fields, 20),
    editingIndex: null,
  };

  edit(index: number) {
    this.setState({
      editingIndex: index,
    });
  }

  clear(index: number) {
    const { fields, count } = this.state;
    const newFields = [...fields];
    newFields.splice(index, 1);
    const optimal = getOptimalCount(newFields);
    const newCount = Number.isNaN(optimal) ? count : optimal;
    this.setState({
      fields: newFields,
      data: mock(newFields, newCount),
      editingIndex: null,
      count: newCount,
    });
  }

  handleChange(field: Field) {
    const { editingIndex, fields, count } = this.state;
    const newFields = [...fields];
    newFields.splice(editingIndex, 1, field);
    const optimal = getOptimalCount(newFields);
    const newCount = Number.isNaN(optimal) ? count : optimal;
    this.setState({
      fields: newFields,
      data: mock(newFields, newCount),
      editingIndex: null,
      count: newCount,
    });
  }

  onTabChange(tab: string) {
    this.setState({ tab });
  }

  onChartChange(type: string) {
    this.setState({ type });
  }

  regenerate() {
    const { fields, count } = this.state;
    this.setState({
      data: mock(fields, count),
    });
  }

  handleCountChange(count: number) {
    const { fields } = this.state;
    this.setState({
      count,
      data: mock(fields, count),
    });
  }

  deploy() {
    const { data, type, tab } = this.state;
    if (tab === 'chart' && type !== undefined) {
      const { data, ...config } = CONFIG_MAP[type];
      // config.configs.responsive = true;
      window.parent.postMessage(
        {
          result: { config, data },
          id,
          type: '__advisor__.mock_chart',
        },
        '*'
      );
    } else if (tab === 'data') {
      window.parent.postMessage(
        {
          result: { data },
          id,
          type: '__advisor__.mock_chart',
        },
        '*'
      );
    }
  }
  render() {
    const { data, fields, editingIndex, count, tab, type } = this.state;
    const columns = new Array(4).fill(undefined).map((_, index) => {
      if (fields[index]) {
        const { name } = fields[index];
        return {
          title: (
            <span className="table-title">
              {name}
              <Icon type="setting" onClick={this.edit.bind(this, index)} />
              <Popconfirm title="确认删除该列么?" onConfirm={this.clear.bind(this, index)}>
                <Icon type="delete" />
              </Popconfirm>
            </span>
          ),
          key: `col-${index + 1}`,
          width: '25%',
          dataIndex: name,
        };
      } else {
        return {
          title: (
            <span className="table-title">
              --
              <Icon type="setting" onClick={this.edit.bind(this, index)} />
            </span>
          ),
          key: `col-${index + 1}`,
          width: '25%',
          render() {
            return '--';
          },
        };
      }
    });
    return (
      <>
        <Tabs activeKey={tab} onChange={this.onTabChange.bind(this)}>
          <Tabs.TabPane tab="选择图表" key="chart" />
          <Tabs.TabPane tab="Mock数据" key="data" />
        </Tabs>
        {tab === 'chart' && (
          <>
            <div className="chart-container">
              {Object.entries(CHART_NAME_MAP).map(([key, value]) => {
                const thumbnail = thumbnails[key];
                console.log(key, value);
                return (
                  <div key={key} className={`chart-item${type === key ? ' active' : ''}`}>
                    <div className="chart">
                      <img onClick={this.onChartChange.bind(this, key)} src={thumbnail?.url} alt={key} />
                    </div>
                    <div>{CHART_NAME_MAP[key]}</div>
                  </div>
                );
              })}
            </div>
            <footer>
              <Form layout="inline">
                <Form.Item style={{ float: 'right' }}>
                  <Button disabled={!type} type="primary" onClick={this.deploy.bind(this)}>
                    去配置
                  </Button>
                </Form.Item>
              </Form>
            </footer>
          </>
        )}
        {tab === 'data' && (
          <>
            <div className="data-container">
              <Table
                rowKey="__uuid"
                scroll={{ y: 360 }}
                dataSource={data.slice(0, 100).map(item => ({ ...item, __uuid: uuid() }))}
                columns={columns}
                pagination={false}
              />
              {editingIndex !== null && (
                <SettingModal
                  value={fields[editingIndex]}
                  onOK={this.handleChange.bind(this)}
                  onCancel={() =>
                    this.setState({
                      editingIndex: null,
                    })
                  }
                />
              )}
            </div>
            <footer>
              <Form layout="inline">
                <Form.Item
                  label={
                    <Tooltip title="最多显示 100 行">
                      行数
                      <Icon style={{ marginLeft: 4 }} type="info-circle" />
                    </Tooltip>
                  }
                >
                  <InputNumber onChange={this.handleCountChange.bind(this)} value={count} min={0} step={1} />
                </Form.Item>
                <Form.Item style={{ float: 'right' }}>
                  <Button type="primary" onClick={this.deploy.bind(this)}>
                    应用数据
                  </Button>
                </Form.Item>
              </Form>
            </footer>
          </>
        )}
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
