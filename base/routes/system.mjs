export default [
  ['PUT', '/sys/exit', 'm.admin & c.system.exit'],
  ['PUT', '/sys/pause', 'm.admin & c.system.pause'],
  ['PUT', '/sys/resume', 'm.admin & c.system.resume'],
  ['GET', '/sys/status', 'm.noQuery & c.system.status'],
  ['GET', '/sys/stats', 'm.noQuery & c.system.stats'],
];
