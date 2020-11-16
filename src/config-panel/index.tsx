import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as G2Plot from '@antv/g2plot';
import * as _ from '@antv/util';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Editor } from '@alipay/g2plot-schemas';
import { Button, message } from 'antd';
import getSchema from './get-schema';
import { isEqual } from '@antv/util';
import '@alipay/g2plot-schemas/lib/editor/index.less';
import './index.less';
import trans from '../local';
import { parseSearch } from '../utils';

const { type, cancopydata } = parseSearch<{ type: string; cancopydata: string }>();

const language: 'zh-CN' | 'en-US' = window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US';

const t = trans.bind(null, language);

function getOption(type: string) {
  const options = G2Plot[type].getDefaultOptions();
  delete options.heigth;
  delete options.width;
  return _.deepMix({}, options);
}

interface State {
  type: string;
  language: 'zh-CN' | 'en-US';
  uuid?: string;
  configs: any;
}

function processConfig(config: any) {
  delete config.height;
  delete config.width;
  if (config && config.trendline && config.trendline.visible === false) {
    // 去掉visible === false的趋势线
    config.trendline = false;
  }
}

function copyConfig(config: any) {
  const { width, height, trendline, ...rest } = config;
  if (trendline && trendline.visible === false) {
    // 去掉visible === false的趋势线
    rest.trendline = undefined;
  } else if (trendline && trendline.visible === true) {
    const { visible, ...r } = trendline;
    rest.trendline = r;
  }
  return rest;
}

/**
 * 去除掉所有默认的配置
 * @param configs - 配置
 * @param defaultCfgs - 默认配置
 */
function shake(configs: any, defaultCfgs: any) {
  const result: any = {};
  if (!defaultCfgs) return configs;
  for (const [key, value] of Object.entries(configs)) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const newValue = shake(value, defaultCfgs[key]);
      if (Object.keys(newValue).length !== 0) result[key] = newValue;
    } else if (Array.isArray(value)) {
      if (!isEqual(configs[key], defaultCfgs[key])) {
        result[key] = value;
      }
    } else {
      if (configs[key] !== defaultCfgs[key]) {
        result[key] = value;
      }
    }
  }
  return result;
}

class App extends React.Component<{}, State> {
  state: State = {
    type,
    language: window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US',
    configs: getOption(type),
  };

  constructor(props) {
    super(props);
    window.addEventListener('message', e => {
      if (e.data.type === '__advisor__.send_configs') {
        this.setState({
          configs: _.deepMix({}, this.state.configs, e.data.configs),
          uuid: e.data.uuid,
        });
      }
    });
  }

  onChange(data) {
    const { uuid } = this.state;
    processConfig(data);
    this.setState({ configs: data });
    window.parent.postMessage({ uuid, configs: data, type: '__advisor__.configs_change' }, '*');
  }

  render() {
    const { type, configs, language } = this.state;
    const schema = getSchema(type, language);
    const { data, ...config } = shake(configs, G2Plot[type].getDefaultOptions());
    return (
      <>
        <Editor key={type} data={configs} schema={schema} onChange={this.onChange.bind(this)} />
        <footer>
          {cancopydata === 'true' && (
            <CopyToClipboard
              text={JSON.stringify(data)}
              onCopy={() => {
                message.success(t('Copy Success'));
              }}
            >
              <Button style={{ marginRight: 16 }} type="primary">
                {t('Copy Data')}
              </Button>
            </CopyToClipboard>
          )}
          <CopyToClipboard
            text={JSON.stringify({ configs: copyConfig(config), type })}
            onCopy={() => {
              message.success(t('Copy Success'));
            }}
          >
            <Button type="primary">{t('Copy Config')}</Button>
          </CopyToClipboard>
        </footer>
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
