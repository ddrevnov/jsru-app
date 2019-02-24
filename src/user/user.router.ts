import * as Router from 'koa-router';
import userController from './user.controller';
import passport from 'src/libs/passport';

const router = new Router();

router.prefix('/users');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.index,
);
router.get('/:id', userController.getById);
router.patch('/:id', userController.update);
router.delete('/:id', userController.deleteById);

export default router;
