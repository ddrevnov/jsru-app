import * as passport from 'koa-passport';
import * as Koa from 'koa';

export default (app: Koa) => {
  app.use(passport.initialize());
  app.use(passport.session());
};
