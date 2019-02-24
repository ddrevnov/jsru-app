import * as passport from 'koa-passport';

import userModel, { IUserModel } from '../../user/user.model';
import localStrategy from './strategies/local';
import facebookStrategy from './strategies/facebook';
import jwtStrategy from './strategies/jwt';

passport.serializeUser((user: IUserModel, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, done);
});

passport.use(jwtStrategy);
passport.use('local', localStrategy);
passport.use(facebookStrategy);

export default passport;
