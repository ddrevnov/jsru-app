import * as crypto from 'crypto';
import { Document, Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import mongooseLib from '../libs/mongoose.lib';
import config from '../utils/config';

export interface IProvider {
  id: string;
  profile: any;
}

export interface IUser {
  email: string;
  displayName: string;
  verifiedEmail: boolean;
  verifyEmailToken: string;
  providers: IProvider[];
  passwordHash?: string;
  salt?: string;
}

export interface IUserModel extends IUser, Document {
  setPassword: (password: string) => void;
  checkPassword: (password: string) => boolean;
  getToken: () => string;
}

const userSchema = new mongooseLib.Schema(
  {
    email: {
      type: String,
      required: "User's E-mail doesn't be empty",
      validate: [
        {
          validator(value) {
            return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
          },
        },
      ],
      unique: 'this email is already exists',
    },
    displayName: {
      type: String,
      required: 'a user should have name',
      unique: 'this name is already exists',
    },
    verifiedEmail: Boolean,
    verifyEmailToken: {
      type: String,
      index: true,
    },
    passwordHash: {
      type: String,
    },
    salt: {
      type: String,
    },
    providers: [
      {
        id: String,
        profile: {},
      },
    ],
  },
  {
    timestamps: true,
  },
);

const generatePassword = (salt, password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      config.crypto.hash.iterations,
      config.crypto.hash.length,
      'sha512',
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      },
    );
  });
};

userSchema.methods.setPassword = async function setPassword(password) {
  if (password !== undefined) {
    if (password.length < 4) {
      throw new Error('Password must be minimum 4 character length');
    }
  }

  this.salt = crypto.randomBytes(config.crypto.hash.length).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

userSchema.methods.getToken = function (): string {
  const token = jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    config.secret,
    { expiresIn: '7d' },
  );

  return token;
};

const User: Model<IUserModel> = mongooseLib.model<IUserModel>(
  'User',
  userSchema,
);

export default User;
