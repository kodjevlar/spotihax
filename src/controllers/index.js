'use strict';
// Setup the router
const router = require('koa-router')();

// Import all controllers
const queue = require('./queue');

// Mount routes
router
  .use('/v1/queue', queue.router.routes(), queue.router.allowedMethods());

module.exports = {
  router
};
