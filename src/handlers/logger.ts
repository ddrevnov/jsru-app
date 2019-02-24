// request/response logger
import * as logger from 'koa-logger';
import * as Koa from 'koa';

export default (app: Koa) => app.use(logger());
