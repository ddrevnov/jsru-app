import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

import userModel from './user.model';

const index = async (ctx: Koa.ParameterizedContext) => {
  ctx.body = await userModel.find({});
};

const getById = async (ctx: Koa.ParameterizedContext) => {
  ctx.body = await userModel.findById(ctx.params.id);
};

const update = async (ctx: Koa.ParameterizedContext) => {
  const { params, request } = ctx;
  ctx.body = await userModel.findByIdAndUpdate(params.id, request.body, {
    new: true,
  });
};

const deleteById = async (ctx: Koa.ParameterizedContext) => {
  const { params } = ctx;
  const user = await userModel.findById(params.id);

  if (!user) {
    ctx.throw(
      HttpStatus.NOT_FOUND,
      HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
    );
  }

  ctx.body = await userModel.findByIdAndDelete(params.id);
};

export default {
  index,
  getById,
  update,
  deleteById,
};
