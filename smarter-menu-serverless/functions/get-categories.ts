import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { baseGetAll } from './util/base-get.util';

const getCategories = baseGetAll('category');

export const handler = middy(getCategories)
  .use(headerMiddleware())
  .use(httpErrorHandler());
