import * as Router from 'koa-router';
import authController from './auth.controller';
import config from 'src/utils/config';
import passport from 'src/libs/passport';

const router = new Router();

router.get('/auth/success', authController.success);
router.get('/auth/failure', authController.failure);
router.post('/login', authController.login);
router.get(
  '/login/facebook',
  passport.authenticate('facebook', config.providers.facebook.passportOptions),
);
router.get(
  '/oauth/facebook',
  passport.authenticate('facebook', {
    session: true,
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
  }),
);

router.post('/logout', authController.logout);
router.post('/signUp', authController.signUp);
router.get('/confirm/:verifyEmailToken', authController.confirmRegister);

export default router;
