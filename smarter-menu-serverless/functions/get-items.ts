import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { baseGetAll } from './util/base-get.util';

const getItems = baseGetAll('item');

export const handler = middy(getItems)
  .use(headerMiddleware())
  .use(httpErrorHandler());
