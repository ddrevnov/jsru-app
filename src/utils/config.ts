import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  // secret data can be moved to env variables
  // or a separate config
  secret: process.env.SECRET || 'mysecret',
  root: process.cwd(),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/jsru-node',
  },
  server: {
    host: process.env.HOST || 'http://localhost',
    port: process.env.PORT || 3000,
  },
  providers: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_SECRET,
      passportOptions: {
        scope: ['email'],
      },
    },
  },
  crypto: {
    hash: {
      length: 128,
      iterations: 10,
    },
  },
  mailer: {
    gmail: {
      user: process.env.TRANSPORT_MAIL,
      password: process.env.TRANSPORT_PASSWORD,
    },
    senders: {
      // transactional emails, register/forgot pass etc
      default: {
        fromEmail: process.env.FROM_EMAIL,
        fromName: process.env.FROM_NAME,
      },
    },
  },
};

export default config;
