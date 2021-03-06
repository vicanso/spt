import mongoose from 'mongoose';
import {Setting} from './names';

const {Schema} = mongoose;

const {Mixed} = Schema.Types;

const schema = {
  // 应用配置名称，用于区分不同的配置
  name: {
    type: String,
    unique: true,
  },
  // 该配置是否禁用状态
  disabled: {
    type: Boolean,
    default: false,
  },
  data: Mixed,
  creator: {
    type: String,
    required: true,
  },
  description: String,
};

export default function init() {
  const s = new Schema(schema, {
    timestamps: true,
  });
  return {
    name: Setting,
    schema: s,
  };
}
