import { Strategy } from 'passport-facebook';
import User from '../../../user/user.model';
import config from 'src/utils/config';

const HOST = config.server.host;
const PORT = config.server.port;

const options = {
  clientID: config.providers.facebook.appId,
  clientSecret: config.providers.facebook.appSecret,
  callbackURL: `${HOST}:${PORT}/oauth/facebook`,
  profileFields: ['displayName', 'email'],
};

const cb = async (accessToken, refreshToken, profile, done) => {
  if (!profile.emails || !profile.emails.length) {
    return done(null, false, { message: 'email does not exists!' });
  }

  const email = profile.emails[0].value;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        displayName: profile.displayName,
        providers: [{ profile, id: 'facebook' }],
      });
      done(null, user, { message: 'success' });
    } else {
      if (user.providers.find((provider) => provider.id === 'facebook')) {
        done(null, user, { message: 'success' });
      } else {
        user.providers.push({ profile, id: 'facebook' });
        await user.save();
        done(null, user, { message: 'success' });
      }
    }
  } catch (err) {
    done(err);
  }
};

const facebookStrategy = new Strategy(options, cb);

export default facebookStrategy;
