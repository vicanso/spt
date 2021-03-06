/**
 * 认证相关中间件
 */

import errors from '../errors';
import * as settingServices from '../services/setting';

/**
 * admin的校验中间件，从Header中获取`Auth-Token`，通过sha1生成字符串与`adminToken`对比，
 * 如果相等，则表示该认证通过
 * @param  {String} adminToken 将token通过sha1生成的字符串
 * @return {Function} 返回中间件处理函数
 */
const admin = () => (ctx, next) => {
  const adminToken = settingServices.get('adminToken');
  const token = ctx.get('Auth-Token');
  if (token && token === adminToken) {
    return next();
  }
  throw errors.get(1);
};

export default {
  admin,
};
