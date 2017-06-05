'use strict';
const router = require('koa-router')();
const queue = require('../queue');

/**
 * Handle client requests
 */
router.get('/', async function(ctx, next) {
  const since = ctx.query.since || Date.now();
  const q = queue.getState();
  ctx.body = JSON.stringify(q.filter(function (track) {
    return track.queuedAt > since;
  }));
});

module.exports = {
  router
};
