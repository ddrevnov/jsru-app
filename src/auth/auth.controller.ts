import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as uuid4 from 'uuid4';

import passport from '../libs/passport';
import User from '../user/user.model';
import sendMail from '../libs/sendEmail.lib';
import logger from '../utils/logger';
import config from '../utils/config';

const PORT = config.server.port;
const HOST = config.server.host;

const success = async (ctx) => {
  const token = ctx.req.user.getToken();
  ctx.body = { token, user: ctx.req.user };
};

const failure = async (ctx) => {
  ctx.body = { message: 'welcome' };
};

const login = async (ctx: Koa.ParameterizedContext, next) => {
  await passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) throw err;

      if (user) {
        await ctx.login(user, { session: false });
        const token = user.getToken();
        ctx.body = { user, token };
      } else {
        ctx.status = HttpStatus.UNAUTHORIZED;
        ctx.body = info;
      }
    },
  )(ctx, next);
};

const logout = async (ctx: Koa.ParameterizedContext) => {
  ctx.logout();
};

const signUp = async (ctx: Koa.ParameterizedContext) => {
  const verifyEmailToken = uuid4();
  const { email, password, displayName } = ctx.request.body;

  try {
    const user = new User({
      email,
      verifyEmailToken,
      displayName,
      verifiedEmail: false,
    });

    await user.setPassword(password);

    await user.save();
  } catch (e) {
    if (e.name === 'ValidationError') {
      let errorMessages = '';
      for (const key in e.errors) {
        errorMessages += `${key}: ${e.errors[key].message}<br>`;
      }
      logger.error(errorMessages);
      ctx.throw(HttpStatus.BAD_REQUEST);
    }
    throw e;
  }

  const info = await sendMail({
    to: email,
    subject: 'Verifying email',
    link: `${HOST}:${PORT}/confirm/${verifyEmailToken}`,
  });

  logger.info(info);

  ctx.body = { success: 'Verify your email. Please check your email.' };
};

const confirmRegister = async (ctx: Koa.ParameterizedContext) => {
  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken,
  });

  if (!user) {
    ctx.throw(
      HttpStatus.NOT_FOUND,
      'Verification link is invalid or has expired.',
    );
  }

  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
  }

  user.verifyEmailToken = null;

  await user.save();

  await ctx.login(user);

  ctx.body = { success: 'Verification is confirmed' };
};

export default {
  success,
  failure,
  login,
  logout,
  signUp,
  confirmRegister,
};
