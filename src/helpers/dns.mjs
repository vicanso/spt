/**
 * 自定义的DNS配置模块，从系统配置中读取，添加至DNS解析中
 */

import _ from 'lodash';
import dns from 'dns';

import * as settingService from '../services/setting';

const dnsSetting = {
  createdAt: 0,
  data: {},
};

// 获取配置的DNS解释信息
function getLookupInfo(name, ttl) {
  if (Date.now() - dnsSetting.createdAt > ttl) {
    // 从配置中读取
    const data = settingService.get('dns');
    const result = {};
    _.forEach(data, item => {
      let {host, ip} = item;
      const {family} = item;
      if (!_.isArray(host)) {
        host = [host];
      }
      if (!_.isArray(ip)) {
        ip = [ip];
      }
      // 将ip与family保存
      _.forEach(host, tmp => {
        result[tmp] = {
          ip,
          family,
        };
      });
    });
    dnsSetting.data = result;
  }
  const info = dnsSetting.data[name];
  if (!info) {
    return null;
  }
  return {
    family: info.family || 4,
    ip: _.sample(info.ip),
  };
}

// 启用dns自定义配置
export default function start(ttl = 300) {
  const {lookup} = dns;
  dns.lookup = (...args) => {
    const info = getLookupInfo(args[0], ttl * 1000);
    if (info) {
      _.last(args)(null, info.ip, info.family);
      return;
    }
    lookup(...args);
  };
}
