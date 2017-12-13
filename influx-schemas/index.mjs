export default {
  userLogin: {
    fields: {
      account: 's',
      ip: 's',
    },
    tags: {
      country: '*',
      region: '*',
      city: '*',
      isp: '*',
    },
    options: {
      stripUnknown: true,
    },
  },
};
