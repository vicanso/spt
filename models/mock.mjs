import mongoose from 'mongoose';

const {
  String,
  Number,
  Mixed,
  Boolean,
} = mongoose.Schema.Types;

export default {
  schema: {
    account: String,
    url: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 500,
    },
    response: Mixed,
    description: String,
    creator: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  indexes: [
    {
      url: 1,
      account: 1,
      unique: true,
    },
  ],
};
