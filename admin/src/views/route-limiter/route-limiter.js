import request from 'axios';
import _ from 'lodash';

import {
  ROUTE_LIMITS,
} from '../../urls';

export default {
  data() {
    return {
      mode: -1,
      form: null,
      routeLimits: null,
      modified: null,
      methods: [
        'GET',
        'POST',
        'PATCH',
        'DELETE',
      ],
      statuses: [
        'enabled',
        'disabled',
      ],
    };
  },
  methods: {
    add() {
      this.form = {};
      this.mode = 1;
    },
    async submit() {
    },
    async loadRouteLimits() {
      const close = this.$loading();
      try {
        const res = await request.get(ROUTE_LIMITS);
        this.routeLimits = _.map(res.data.routeLimits, (item) => {
          item.date = _.map(item, tmp => new Date(tmp));
          console.dir(item.date);
          return item;
        })
        console.dir(this.routeLimits);
        this.mode = 0;
      } catch (err) {
        this.$error(err);
      } finally {
        close();
      }
    },
  },
  beforeMount() {
    this.loadRouteLimits();
  },
};
