import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { baseGetAll } from './util/base-get.util';

const getItemsMeta = baseGetAll('meta');

export const handler = middy(getItemsMeta)
  .use(headerMiddleware())
  .use(httpErrorHandler());
