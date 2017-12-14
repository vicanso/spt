/**
 * 此模块主要是一些公共与业务无关的处理
 */

import BlueBird from 'bluebird';
import moment from 'moment';
import path from 'path';
import originalFs from 'fs';

import * as config from '../config';
import * as globals from '../helpers/globals';


const fs = BlueBird.promisifyAll(originalFs);


/**
 * 获取系统当前运行的版本package.json与读取文件package.json的版本号，
 * 正常情况下两者一致，但是如果更新了版本，但是没有重启就会不一致
 * @return {Object} 返回版本号信息 {pkg: 程序版本号, gen: 生成镜像的时间版本号}
 */
async function getVersion() {
  const buf = await fs.readFileAsync(path.join(config.appPath, 'assets/version'));
  return {
    pkg: config.version,
    gen: buf.toString(),
  };
}

/**
 * @swagger
 * /sys/pause:
 *  put:
 *    description: 设置程序为暂停状态
 *    responses:
 *      204:
 *        description: 执行成功时返回数据为空
 */
export function pause(ctx) {
  globals.pause();
  console.info('pause application');
  ctx.body = null;
}

/**
 * 重置系统状态为`running`，此时系统对于`/ping`的响应会正常返回
 * @param {Method} PUT
 * @prop {Middleware} admin
 * @prop {Route} /sys/resume
 * @return {Body} nobody 204
 */
export function resume(ctx) {
  globals.start();
  console.info('resume application');
  ctx.body = null;
}

/**
 * 获取当前系统的状态，包括当前连接数，系统状态，版本，运行时长等
 * @param {Method} GET
 * @prop {Middleware} noQuery
 * @prop {Route} /sys/status
 * @example curl -XGET 'http://127.0.0.1:5018/sys/status'
 * @return {Body} {
 * connectingTotal: Integer,
 * status: String,
 * version: Object,
 * uptime: String,
 * startedAt: ISOString,
 * }
 */
export async function status(ctx) {
  const version = await getVersion();
  const uptime = moment(Date.now() - (Math.ceil(process.uptime()) * 1000));
  ctx.setCache('10s');
  ctx.body = {
    server: config.server,
    connectingTotal: globals.getConnectingCount(),
    status: globals.isRunning() ? 'running' : 'pause',
    version,
    uptime: uptime.fromNow(),
    startedAt: uptime.toISOString(),
  };
}

/**
 * 获取当前系统的性能统计
 *
 * @param {Method} GET
 * @prop {Middleware} noQuery
 * @prop {Route} /sys/stats
 * @example curl -XGET 'http://127.0.0.1:5018/sys/stats'
 * @return {Body} {}
 */
export async function stats(ctx) {
  const performance = globals.getPerformance();
  const data = {
    app: config.app,
    uptime: Math.ceil(process.uptime()),
    pid: process.pid,
  };
  if (performance) {
    Object.assign(data, {
      connecting: performance.connectingCount,
      cpu: performance.cpuUsageUsedPercent,
      memory: performance.memoryUsageRss,
    });
  }
  ctx.body = data;
}

/**
 * 此函数只是退出当前应用，如果有守护进程之类可用于graceful reload`
 * @param {Method} PUT
 * @prop {Middleware} admin
 * @prop {Route} /sys/exit
 * @return {Body} nobody 204
 */
export function exit(ctx) {
  process.emit('SIGQUIT');
  ctx.body = null;
}
