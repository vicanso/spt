import Joi from 'joi';
import _ from 'lodash';
import shortid from 'shortid';

import errors from '../errors';
import * as userService from '../services/user';
import * as config from '../config';
import {
  getLoginFailCount,
  incLoginFailCount,
} from '../services/limiter';
/**
 * @swagger
 * parameters:
 *  account:
 *    name: account
 *    description: 用户账户，Joi.string().trim().min(4).max(32)
 *    type: string
 *    in: formData
 *  password:
 *    name: password
 *    description: 用户密码，Joi.string().trim().max(256)
 *    type: string
 *    in: formData
 *  email:
 *    name: email
 *    description: 用户邮箱，Joi.string().trim().email().max(64)
 *    type: string
 *    in: formData
 *  roles:
 *    name: roles
 *    description: 用户角色权限，Joi.array().items(Joi.string().valid(['admin', 'tester']))
 *    type: array
 *    items:
 *      type: string
 *    in: formData
 */
const defaultSchema = {
  account: Joi.string().trim().min(4).max(32),
  password: Joi.string().trim().max(256),
  email: Joi.string().trim().email().max(64),
  roles: Joi.array().items(Joi.string().valid(['admin', 'tester'])),
};


/**
 * @swagger
 * definitions:
 *  UserInfo:
 *    required:
 *      - anonymous
 *      - date
 *    properties:
 *      anonymous:
 *        description: 是否匿名用户
 *        type: boolean
 *      date:
 *        description: 服务器时间，ISO Date String
 *        type: string
 *        example: 2017-12-18T12:52:23.651Z
 *      account:
 *        description: 用户账号
 *        type: string
 *      roles:
 *        description: 用户角色权限
 *        type: array
 *        items:
 *          type: string
 */
function pickUserInfo(userInfos) {
  const keys = 'account roles'.split(' ');
  let anonymous = true;
  if (userInfos && userInfos.account) {
    anonymous = false;
  }
  return _.extend({
    anonymous,
    date: new Date().toISOString(),
  }, _.pick(userInfos, keys));
}

/**
 * @swagger
 * /users/register:
 *  post:
 *    description: 注册新账号。中间件：m.anonymous
 *    summary: 注册账号
 *    tags:
 *      - user
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - $ref: '#/parameters/account'
 *      - $ref: '#/parameters/password'
 *      - $ref: '#/parameters/email'
 *    responses:
 *      201:
 *        description: 注册成功
 *        schema:
 *          type: object
 *          $ref: '#/definitions/UserInfo'
 *
 */
export async function register(ctx) {
  const data = Joi.validate(ctx.request.body, {
    account: defaultSchema.account.required(),
    password: defaultSchema.password.required(),
    email: defaultSchema.email.required(),
  });
  const doc = await userService.register(data);
  const user = pickUserInfo(doc);
  ctx.session.user = user;
  ctx.status = 201;
  ctx.body = user;
  userService.addLoginRecord({
    account: user.account,
    userAgent: ctx.get('User-Agent'),
    ip: ctx.ip,
    track: ctx.cookies.get(config.trackCookie),
  });
}

/**
 * @swagger
 * /users/logout:
 *  delete:
 *    description: 退出用户当前登录态。中间件：m.login
 *    summary: 注销登录
 *    tags:
 *      - user
 *    responses:
 *      200:
 *        description: 注销登录态成功
 *        schema:
 *          type: object
 *          $ref: '#/definitions/UserInfo'
 */
export async function logout(ctx) {
  delete ctx.session.user;
  ctx.body = pickUserInfo({});
}

/**
 * @swagger
 * /users/login:
 *  get:
 *    description: 获取登录加密使用的Token。中间件：m.anonymous
 *    summary: 获取登录Token
 *    tags:
 *      - user
 *    responses:
 *      200:
 *        description: 返回Token
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *              description: 随机生成的Token
 *              example: ryl3sFgBfz
 *  post:
 *    description: 用户登录。中间件：m.anonymous
 *    summary: 用户登录
 *    consumes:
 *      - multipart/form-data
 *    tags:
 *      - user
 *    parameters:
 *      - $ref: '#/parameters/account'
 *      - $ref: '#/parameters/password'
 *    responses:
 *      200:
 *        description: 登录成功，返回用户信息
 *        schema:
 *          type: object
 *          $ref: '#/definitions/UserInfo'
 */
export function loginToken(ctx) {
  const {
    session,
  } = ctx;
  const user = {
    token: shortid(),
  };
  session.user = user;
  ctx.set('Cache-Control', 'no-store');
  // eslint-disable-next-line
  ctx.body = user;
}
export async function login(ctx) {
  const {
    session,
  } = ctx;
  const token = _.get(session, 'user.token');
  if (!token) {
    throw errors.get('user.tokenIsNull');
  }
  const {
    account,
    password,
  } = Joi.validate(ctx.request.body, {
    account: defaultSchema.account.required(),
    password: defaultSchema.password.required(),
  });
  const failCount = await getLoginFailCount(account);
  console.dir(failCount);
  if (failCount > 5) {
    throw errors.get('user.loginFailExceededLimit');
  }
  let user = null;
  try {
    user = await userService.login({
      account,
      password,
      token,
    });
  } catch (err) {
    incLoginFailCount(account);
    throw err;
  }
  ctx.session.user = user;
  ctx.body = pickUserInfo(user);
  userService.addLoginRecord({
    account: user.account,
    userAgent: ctx.get('User-Agent'),
    ip: ctx.ip,
    track: ctx.cookies.get(config.trackCookie),
  });
}
