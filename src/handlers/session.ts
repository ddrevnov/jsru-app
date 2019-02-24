import * as session from 'koa-session';
import * as Koa from 'koa';

/*
const sessions = {
  [id]: {count: 4}
};
*/
// ctx.session
export default (app: Koa) =>
  app.use(
    session(
      {
        signed: false,
      },
      app,
    ),
  );
