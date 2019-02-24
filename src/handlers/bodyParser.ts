import * as bodyParser from 'koa-bodyparser';
import * as Koa from 'koa';

// ctx.request.body = {name: '', password: '', ...}

export default (app: Koa) =>
  app.use(
    bodyParser({
      jsonLimit: '56kb',
    }),
  );
