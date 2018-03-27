import request from 'axios';
import {
  SETTINGS,
} from '../../urls';

export default {
  data() {
    return {
      form: {},
    };
  },
  methods: {
    async submit() {
      const {
        name,
        disabled,
        data,
        description,
      } = this.form;
      if (!name || !data || !description) {
        this.$error('name, data and description can\'t be null');
        return;
      }
      const close = this.$loading();
      try {
        await request.post(SETTINGS, {
          name,
          disabled,
          data: JSON.parse(data),
          description,
        });
      } catch (err) {
        this.$error(err);
      } finally {
        close();
      }
       
    },
  },
};
