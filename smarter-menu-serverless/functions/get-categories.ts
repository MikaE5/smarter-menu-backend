import middy from '@middy/core';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import { headerMiddleware } from '../middleware/header.middleware';
import { CustomerSchema } from '../schemas/customer.schema';
import { baseGetAll } from './util/base-get.util';

const getCategories = baseGetAll('category');

export const handler = middy(getCategories)
  .use(headerMiddleware())
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema: CustomerSchema,
    })
  )
  .use(httpErrorHandler());
