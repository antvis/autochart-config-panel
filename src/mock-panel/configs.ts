import { mock, Field } from '../mock-data';
const lines = mock(
  [
    { name: 'date', type: 'date', start: '2019/03/01', end: '2019/03/10', step: '1d', format: 'yyyy/MM/dd' },
    { name: 'value', type: 'number', min: 0, max: 1000 },
    { name: 'city', type: 'enum', values: ['上海', '深圳', '成都'], distribution: 'cartesian' },
  ] as Field[],
  30
);

const line = mock(
  [
    { name: 'date', type: 'date', start: '2019/03/01', end: '2019/03/10', step: '1d', format: 'yyyy/MM/dd' },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  10
);

const pie = mock(
  [
    {
      name: 'type',
      values: ['上海', '成都', '杭州', '深圳'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  4
);

const bar = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都', '杭州', '深圳', '香港', '北京', '重庆'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  7
);

const bars = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都', '杭州', '深圳', '香港', '北京', '重庆'],
      type: 'enum',
      distribution: 'cartesian',
    },
    {
      name: 'gender',
      values: ['男', '女'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  14
);

const barss = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都', '杭州', '深圳', '香港', '北京', '重庆'],
      type: 'enum',
      distribution: 'cartesian',
    },
    {
      name: 'type',
      values: ['分类一', '分类二', '分类三'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  21
);

const radar = mock(
  [
    {
      name: 'type',
      values: ['防御', '攻击', '速度', '穿透', '护甲', '暴击'],
      type: 'enum',
      distribution: 'cartesian',
    },
    {
      name: 'name',
      values: ['孙尚香', '黄忠'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 100 },
  ] as Field[],
  12
);

const histogram = mock(
  [
    { name: 'value', type: 'number', min: 0, max: 100 },
  ] as Field[],
  60
);

const scatter = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都', '杭州'],
      type: 'enum',
      distribution: 'random',
    },
    { name: 'count', type: 'number', min: 0, max: 1000 },
    { name: 'value', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  1000
);

const bubble = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都'],
      type: 'enum',
      distribution: 'random',
    },
    { name: 'count', type: 'number', min: 0, max: 1000 },
    { name: 'value', type: 'number', min: 0, max: 1000 },
    { name: 'size', type: 'number', min: 0, max: 1000 },
  ] as Field[],
  100
);

const heatmap = mock(
  [
    {
      name: 'city',
      values: ['上海', '成都', '杭州', '深圳', '香港', '北京', '重庆'],
      type: 'enum',
      distribution: 'cartesian',
    },
    {
      name: 'type',
      values: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七', '分类八'],
      type: 'enum',
      distribution: 'cartesian',
    },
    { name: 'value', type: 'number', min: 0, max: 100 },
  ] as Field[],
  56
);

export const CONFIG_MAP = {
  MultiLine: {
    data: lines,
    configs: {
      xField: 'date',
      yField: 'value',
      seriesField: 'city',
    },
    type: 'Line',
  },
  StackedArea: {
    data: lines,
    configs: {
      xField: 'date',
      yField: 'value',
      seriesField: 'city',
      isStack: true,
    },
    type: 'Area',
  },
  Line: {
    data: line,
    configs: {
      xField: 'date',
      yField: 'value',
    },
    type: 'Line',
  },
  Pie: {
    data: pie,
    configs: {
      angleField: 'value',
      colorField: 'type',
    },
    type: 'Pie',
  },
  Donut: {
    data: pie,
    configs: {
      angleField: 'value',
      colorField: 'type',
      innerRadius: 0.64,
      statistic: {
        title: {
          offsetY: -18,
          style: {
            fontSize: 16,
          }
        },
        content: {
          offsetY: 8,
          style: {
            fontSize: 24,
          },
        },
      }
    },
    type: 'Pie',
  },
  Area: {
    data: line,
    configs: {
      xField: 'date',
      yField: 'value',
    },
    type: 'Area',
  },
  Column: {
    data: bar,
    configs: {
      xField: 'city',
      yField: 'value',
    },
    type: 'Column',
  },
  GroupedColumn: {
    data: bars,
    configs: {
      xField: 'city',
      yField: 'value',
      seriesField: 'gender',
      isGroup: true,
    },
    type: 'Column',
  },
  StackedColumn: {
    data: bars,
    configs: {
      xField: 'city',
      yField: 'value',
      seriesField: 'gender',
      isStack: true,
    },
    type: 'Column',
  },
  PercentageStackedColumn: {
    data: barss,
    configs: {
      xField: 'city',
      yField: 'value',
      seriesField: 'type',
      isStack: true,
      isPercent: true,
    },
    type: 'Column',
  },
  Bar: {
    data: bar,
    configs: {
      xField: 'value',
      yField: 'city',
    },
    type: 'Bar',
  },
  GroupedBar: {
    data: bars,
    configs: {
      xField: 'value',
      yField: 'city',
      seriesField: 'gender',
      isGroup: true,
    },
    type: 'Bar',
  },
  StackedBar: {
    data: bars,
    configs: {
      xField: 'value',
      yField: 'city',
      seriesField: 'gender',
      isStack: true,
    },
    type: 'Bar',
  },
  PercentageStackedBar: {
    data: barss,
    configs: {
      xField: 'value',
      yField: 'city',
      seriesField: 'type',
      isStack: true,
      isPercent: true,
    },
    type: 'Bar',
  },
  Scatter: {
    data: scatter,
    configs: {
      xField: 'value',
      yField: 'count',
      colorField: 'city',
      shape: 'circle'
    },
    type: 'Scatter',
  },
  Bubble: {
    data: bubble,
    configs: {
      xField: 'value',
      yField: 'count',
      sizeField: 'size',
      colorField: 'city',
      size: [2, 16],
      shape: 'circle'
    },
    type: 'Scatter',
  },
  Radar: {
    data: radar,
    configs: {
      xField: 'type',
      yField: 'value',
      seriesField: 'name',
    },
    type: 'Radar',
  },
  Histogram: {
    data: histogram,
    configs: {
      binField: 'value',
      binWidth: 4,
    },
    type: 'Histogram',
  },
  Heatmap: {
    data: heatmap,
    configs: {
      xField: 'type',
      yField: 'city',
      colorField: 'value',
    },
    type: 'Heatmap'
  }
};
