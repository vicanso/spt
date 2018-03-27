import _ from 'lodash';

import {sha256} from './crypto';

// 获取出错信息
export function getErrorMessage(err) {
  let message = err;
  if (err && err.response) {
    const {data, headers} = err.response;
    const id = headers['x-response-id'];
    // eslint-disable-next-line
    const code = data.code.replace(`${APP}-`, '');
    message = `${data.message}(${code}) [${id}]`;
  }
  if (_.isError(message)) {
    message = message.message;
  }
  if (err.code === 'ECONNABORTED') {
    message = '请求超时，请重新再试';
  }
  return message;
}

// 生成密码
export function genPassword(account, password) {
  const pwd = sha256(password);
  const app = APP || 'unknown';
  return sha256(`${account}-${pwd}-${app}`);
}

// 获取日期格式化字符串
export function getDate(str) {
  const date = new Date(str);
  const fill = v => {
    if (v >= 10) {
      return `${v}`;
    }
    return `0${v}`;
  };
  const month = fill(date.getMonth() + 1);
  const day = fill(date.getDate());
  const hours = fill(date.getHours());
  const mintues = fill(date.getMinutes());
  const seconds = fill(date.getSeconds());
  return `${date.getFullYear()}-${month}-${day} ${hours}:${mintues}:${seconds}`;
}

// 等待ttl时长
export function waitFor(ttl, startedAt) {
  let delay = ttl;
  if (startedAt) {
    delay = ttl - (Date.now() - startedAt);
  }
  return new Promise(resolve => {
    setTimeout(resolve, Math.max(0, delay));
  });
}
