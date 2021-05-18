import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { apiResponse } from '../util/api-response.util';

const hello = async (event: APIGatewayProxyEvent) => {
  return apiResponse._200({ msg: 'Hello from smarter-menu!' });
};

export const handler = middy(hello)
  .use(headerMiddleware())
  .use(httpErrorHandler());
