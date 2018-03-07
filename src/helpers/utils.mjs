import request from 'superagent';

import * as config from '../config';

/**
 * 从参数列表中获取第一个符合条件的参数返回，如果都不符合，则使用默认值返回
 * @param  {Array} arr 参数列表
 * @param  {Function} validate 校验函数，如果符合则返回true
 * @param  {Any} defaultValue 默认值
 * @return {Any} 返回符合条件的值或者默认值
 * @example
 * const utils = require('./helpers/utils');
 * // max: 100
 * const max = utils.getParam(['name', true, 100], _.isInteger, 10);
 */
export function getParam(arr, validate, defaultValue) {
  const v = arr.find(validate);
  if (v === undefined) {
    return defaultValue;
  }
  return v;
}

/**
 * 请求当前应用
 * @param {String} method http request method
 * @param {String} url http request url
 */
export function selfRequest(method, url) {
  const requestUrl = `http://127.0.0.1:${config.port}${url}`;
  return request[method](requestUrl);
}

/**
 * 延时执行(Promise)
 * @param {Integer} ms 延时的ms
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 该请求是否不可以缓存
 * @param {Context} ctx
 */
export function isNoCache(ctx) {
  const {method} = ctx;
  if (method !== 'GET' && method !== 'HEAD') {
    return true;
  }
  if (
    ctx.get('Cache-Control') === 'no-cache' ||
    ctx.query['cache-control'] === 'no-cache'
  ) {
    return true;
  }
  return false;
}

export function isDevelopment() {
  return config.env === 'development';
}

export function isProduction() {
  return config.env === 'production';
}