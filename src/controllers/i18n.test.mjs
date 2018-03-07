import Koa from 'koa';
import Stream from 'stream';
import shortid from 'shortid';

import '../helpers/joi-extend';

import {add} from './i18n';

function createContext() {
  const socket = new Stream.Duplex();
  const req = Object.assign({headers: {}, socket}, Stream.Readable.prototype);
  const res = Object.assign({_headers: {}, socket}, Stream.Writable.prototype);
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  const app = new Koa();
  // eslint-disable-next-line
  res.getHeader = k => res._headers[k.toLowerCase()];
  // eslint-disable-next-line
  res.setHeader = (k, v) => (res._headers[k.toLowerCase()] = v);
  // eslint-disable-next-line
  res.removeHeader = k => delete res._headers[k.toLowerCase()];
  return app.createContext(req, res);
}

test('add i18n', async () => {
  const ctx = createContext();
  ctx.session = {
    user: {
      account: 'vicanso',
    },
  };
  ctx.request.body = {
    name: shortid(),
    category: 'test',
    en: 'title',
    zh: '标题',
  };
  await add(ctx);
});
