export function parseSearch<T = any>(): T {
  const querys: any = {};
  window.location.search
    .slice(1)
    .split('&')
    .forEach(item => {
      const [key, value] = item.split('=');
      querys[key] = decodeURIComponent(value);
    });
  return querys;
}

export function uuid() {
  return `uuid${'-xxxx-xxx'.replace(/x/g, () => ((Math.random() * 16) | (0 & 0x3)).toString(16))}`;
}
