import random from '@antv/dw-random';
import { format as formatDate } from 'date-fns';

const MARK = {
  s: 1e3,
  m: 60 * 1e3,
  h: 60 * 60 * 1e3,
  d: 24 * 60 * 60 * 1e3,
};

function range(start: number, end: number, step: number): number[] {
  let i = 0;
  const result: number[] = [];
  while (true) {
    const item = start + i * step;
    if (item > end) break;
    result.push(item);
    i++;
  }
  return result;
}

function dateRange(start: number | string, end: number | string, step: number | string, format: string) {
  if (!(typeof step === 'string' || typeof step == 'number')) throw new TypeError('xxx');

  if (typeof step === 'string') {
    if (/(\d+)(s|m|h|d)/.test(step)) {
      step = MARK[RegExp.$2] * Number.parseFloat(RegExp.$1);
    } else {
      throw new TypeError('xxx');
    }
  }

  if (typeof step === 'number') {
    if (step === 0 || Number.isNaN(step)) throw new TypeError('xxxx');
  }

  if (typeof start === 'string') {
    start = new Date(start).getTime();
  }

  if (typeof end === 'string') {
    end = new Date(end).getTime();
  }

  return range(start, end, step).map(item => formatDate(item, format));
}

export interface ValuesField {
  type: 'enum';
  name: string;
  distribution: 'random' | 'sequential' | 'cartesian';
  values: string[];
}

export interface DateField {
  type: 'date';
  name: string;
  start: string;
  end: string;
  step: string;
  format: string;
}

export interface NumberField {
  type: 'number';
  name: string;
  min: number;
  max: number;
  decimals: number;
}

export type Field = ValuesField | DateField | NumberField;

export function getOptimalCount(fields: Field[]): number {
  if (fields.every(item => item.type === 'number')) return NaN;

  return getDivisor(fields, -1);
}

function getDivisor(fields: Field[], cindex: number): number {
  let divisor = 1;
  for (let i = cindex + 1; i < fields.length; i++) {
    const field = fields[i];
    if (field.type === 'enum' && field.distribution === 'cartesian') {
      if (field.values && field.values.length) {
        divisor *= field.values.length || 1;
      }
    }
    if (field.type === 'date') {
      const { start, end, step, format } = field;
      const dates = dateRange(start, end, step, format);
      if (dates && dates.length) {
        divisor *= dates.length;
      }
    }
  }
  return divisor;
}

export function mock(fields: Field[], count: number): any[] {
  const factories = fields.map((item, cindex) => {
    if (item.type === 'number') {
      const { min = 0, max = 1000, decimals = 0 } = item;
      return () => random.float({ min, max, fixed: decimals });
    }
    if (item.type === 'enum') {
      const { values, distribution } = item;
      return (rindex: number) => {
        if (distribution === 'cartesian') {
          const divisor = getDivisor(fields, cindex);
          return values[Math.floor(rindex / divisor) % values.length];
        }
        if (distribution === 'sequential') return values[rindex % values.length];
        return random.pickone(values);
      };
    }
    if (item.type === 'date') {
      const { start, end, step, format } = item;
      const values = dateRange(start, end, step, format);
      const divisor = getDivisor(fields, cindex);
      return (rindex: number) => values[Math.floor(rindex / divisor) % values.length];
    }
  });
  return new Array(count).fill(undefined).map((_, rindex) => {
    const row: Record<string, any> = {};
    factories.forEach((factory, cindex) => {
      row[fields[cindex].name] = factory(rindex);
    });
    return row;
  });
}
