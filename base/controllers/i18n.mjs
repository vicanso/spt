import Joi from 'joi';
import _ from 'lodash';

import i18nService from '../services/i18n';
import debug from '../helpers/debug';

const defaultSchema = {
  name: Joi.string().max(100),
  category: Joi.string().max(20),
  en: Joi.string().max(100),
  zh: Joi.string().max(50),
};


export async function add(ctx) {
  const data = Joi.validate(ctx.request.body, defaultSchema);
  data.creator = ctx.session.user.account;
  const doc = await i18nService.add(data);
  ctx.status = 201;
  ctx.body = doc;
}

export async function list(ctx) {
  const {
    category,
    count,
  } = Joi.validate(ctx.query, {
    category: Joi.alternatives().try(
      defaultSchema.category,
      Joi.array().items(defaultSchema.category),
    ),
    count: Joi.boolean(),
  });
  let cats = category;
  const conditions = {};
  if (cats) {
    if (!_.isArray(cats)) {
      cats = [cats];
    }
    conditions.category = cats;
  }
  const items = await i18nService.find(conditions);
  const result = {
    items: _.sortBy(items, item => item.category + item.name),
  };
  if (count) {
    result.count = await i18nService.count(conditions);
  }
  ctx.setCache('5s');
  debug('list i18n conditions:%j, result:%j', conditions, result);
  ctx.body = result;
}
