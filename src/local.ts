const map = {
  'Copy Config': '拷贝配置',
  'Copy Success ': '拷贝成功',
  'Copy Data': '拷贝数据',
};

export default function trans(language: 'zh-CN' | 'en-US', key: string) {
  if (language === 'zh-CN') return map[key] || key;
  return key;
}
