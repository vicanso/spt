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
      const {
        name,
        path,
        method,
        status,
        date,
        time,
      } = this.form;
      if (!name || !path) {
        this.$error('name and path can not be null');
        return;
      }
      const data = {
        name,
        path,
        method,
        status,
      };
      if (date) {
        data.date = _.map(date, item => item.toISOString());
      }
      if (time) {
        data.time = _.map(time, (item) => {
          const date = item.toISOString();
          return date.substring(11, 19);
        });
      }
      const close = this.$loading();
      try {
        await request.post(ROUTE_LIMITS, data);
        await this.loadRouteLimits();
      } catch (err) {
        this.$error(err);
      } finally {
        close();
      }
    },
    async loadRouteLimits() {
      const close = this.$loading();
      try {
        const res = await request.get(ROUTE_LIMITS);
        this.routeLimits = _.map(res.data.routeLimits, (item) => {
          item.date = _.map(item.date, tmp => new Date(tmp));
          item.time = _.map(item.time, (tmp) => {
            const date = new Date(`2018-01-01T${tmp}.000Z`);
            return date;
          });
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
