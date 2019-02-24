import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from '..';
import User from 'src/user/user.model';
import config from 'src/utils/config';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

export default new Strategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ id: jwt_payload.sub });

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});
