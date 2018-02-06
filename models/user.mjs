import mongoose from 'mongoose';

const {
  String,
} = mongoose.Schema.Types;

export default {
  // model的schema定义
  schema: {
    // 账号
    account: {
      type: String,
      required: true,
      unique: true,
    },
    // 密码，加密串
    password: {
      type: String,
      required: true,
    },
    // email，唯一的，用于取回密码等
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // 权限 su admin等
    roles: [
      String,
    ],
  },
};
