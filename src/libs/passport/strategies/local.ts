import { Strategy } from 'passport-local';

import userModel, { IUserModel } from '../../../user/user.model';
import logger from '../../../utils/logger';

export default new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user: IUserModel = await userModel.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'User does not exist' });
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Password is wrong.' });
      }

      if (!user.verifiedEmail) {
        return done(null, false, { message: 'Email is not verified.' });
      }

      return done(null, user, { message: 'You are welcome' });
    } catch (err) {
      logger.error(err);
      done(err);
    }
  },
);
