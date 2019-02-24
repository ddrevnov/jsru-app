import * as Koa from 'koa';

import { logger as loggerHandler, session, bodyParser, passport } from './handlers';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import logger from './utils/logger';

const app = new Koa();

// Init helpers
loggerHandler(app);
session(app);
bodyParser(app);
passport(app);

// Catch errors
app.use(async (ctx: Koa.ParameterizedContext, next: () => void) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      ctx.body = e.message;
      ctx.status = e.status;
    } else {
      ctx.status = 500;
      logger.error(e.message, e.stack);
    }
  }
});

// Init routers
app.use(userRouter.routes());
app.use(authRouter.routes());

export default app;
