'use strict';
const fs = require('fs');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const koaAccesslog = require('koa-accesslog');

const controllers = require('./controllers');

app
  .use(koaAccesslog())
  .use(koaBody())
  .use(controllers.router.routes())
  .use(controllers.router.allowedMethods());

const options = {
  key: fs.readFileSync('/home/node/app/creds/server.key'),
  cert: fs.readFileSync('/home/node/app/creds/server.crt')
};

https
  .createServer(options, app.callback())
  .listen(process.env.PORT, function() {
  console.log('Server started on port', process.env.PORT);
});

process.on('SIGTERM', function() {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

