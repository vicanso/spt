import mongoose from 'mongoose';

import {I18n} from './names';

const {Schema} = mongoose;

const schema = {
  name: {
    type: String,
    required: true,
  },
  // 该字段分类，方便可以直接把所有分类的取出
  category: {
    type: String,
    required: true,
  },
  // 英文
  en: String,
  // 中文
  zh: String,
  creator: {
    type: String,
    required: true,
  },
};

export default function init() {
  const s = new Schema(schema, {
    timestamps: true,
  });
  s.index(
    {
      category: 1,
    },
    {
      background: true,
    },
  );
  s.index(
    {
      name: 1,
    },
    {
      background: true,
    },
  );
  s.index(
    {
      category: 1,
      name: 1,
    },
    {
      background: true,
      unique: true,
    },
  );
  return {
    name: I18n,
    schema: s,
  };
}
