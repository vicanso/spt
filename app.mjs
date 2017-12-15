import './base/init';

import mongo from './base/helpers/mongo';
import redis from './base/helpers/redis';

import * as settingService from './base/services/setting';
import influx from './base/helpers/influx';
import dns from './base/helpers/dns';
import createServer from './base/helpers/server';
import './base/schedules';


function mongodbReady() {
  return new Promise((resolve) => {
    mongo.once('connected', resolve);
  });
}

function redisReady() {
  return new Promise((resolve) => {
    redis.once('connect', resolve);
  });
}

Promise.all([
  mongodbReady(),
  redisReady(),
  settingService.updateAppSettings(),
]).then(() => {
  const influxUrl = settingService.get('influx.url');
  if (influxUrl) {
    influx.init(influxUrl);
  }
  // 启用自定义DNS，如果没有自定义的需求，可以不使用
  dns();
  createServer();
}).catch((err) => {
  console.error(`the application isn't ready, ${err.message}`);
});
