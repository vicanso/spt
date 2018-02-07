export default {
  schema: {
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
  },
  indexes: [
    {
      category: 1,
    },
    {
      name: 1,
    },
    {
      category: 1,
      name: 1,
      unique: true,
    },
  ],
};
