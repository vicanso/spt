import _ from 'lodash';
import bluebird from 'bluebird';
import mongoose from 'mongoose';

import * as config from '../config';
import baseModels from '../models';
import customModels from '../../models';
import savePlugin from '../plugins/mongo-save';
import updatePlugin from '../plugins/mongo-update';
import statsPlugin from '../plugins/mongo-stats';

const {
  Schema,
} = mongoose;
mongoose.Promise = bluebird;


/**
 * 初始化models，读取所有配置的model，初始化。
 * 并增加公共的统计hook函数
 * @param  {MongooseClient} conn   mongoose实例化的client
 */
function initModels(conn) {
  const models = _.extend({}, baseModels, customModels);
  _.forEach(models, (model, key) => {
    const name = model.name || (key.charAt(0).toUpperCase() + key.substring(1));
    const schema = new Schema(model.schema, model.options);
    statsPlugin(schema, name);
    updatePlugin(schema);
    savePlugin(schema);
    if (model.indexes) {
      _.forEach(model.indexes, (indexConfig) => {
        const optionKeys = ['unique', 'expireAfterSeconds'];
        const options = _.extend({
          background: true,
        }, _.pick(indexConfig, optionKeys));
        const fields = _.omit(indexConfig, optionKeys);
        schema.index(fields, options);
      });
    }
    conn.model(name, schema);
  });
}

/**
 * 根据mongodb连接串初始化Mongoose Connection
 * @param  {String} uri     mongodb连接串：mongodb://user:pass@localhost:port/database
 * @param  {Object} options mongoose中createConnection的options
 * @return {Connection}  Mongoose Connection
 */
function initClient(uri, options) {
  /* istanbul ignore if */
  if (!uri) {
    return null;
  }
  const opts = _.extend({
    db: {
      native_parser: true,
    },
    server: {
      poolSize: 5,
    },
  }, options);
  const client = mongoose.createConnection(uri, opts);
  const maskUri = uri.replace(/\/\/\S+:\S+@/, '//***:***@');
  client.on('connected', () => {
    console.info(`${maskUri} connected`);
  });
  client.on('disconnected', () => {
    /* istanbul ignore next */
    console.alert(`${maskUri} disconnected`);
  });
  client.on('reconnected', _.debounce(() => {
    /* istanbul ignore next */
    console.info(`${maskUri} reconnected`);
  }, 3000));
  client.on('connecting', () => {
    /* istanbul ignore next */
    console.info(`${maskUri} connecting`);
  });
  client.on('error', err => console.alert(`${maskUri} error, %s`, err));
  initModels(client);
  return client;
}

const client = initClient(config.mongoUri);

export default client;

/**
 * 获取mongodb model
 * @param  {String} name collection的名称
 * @return {Model} mongoose model
 */
export function get(name) {
  return client.model(name);
}
