import './base/init';

import mongo from './base/helpers/mongo';
import redis from './base/helpers/redis';

import * as settingService from './base/services/setting';
import influx from './base/helpers/influx';
import dns from './base/helpers/dns';


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
}).catch((err) => {
  console.error(`the application isn't ready, ${err.message}`);
});

// import * as errors from './base/errors';
// import debug from './base/helpers/debug';
// import * as globals from './base/helpers/globals';

// import setttingService from './base/services/setting';

// console.dir(errors.get('common.tokenInvalid'));
// debug('ABCD');
// console.dir(globals.getConcurrency());
// console.dir(setttingService);

