import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../util/api-response.util';

export const headerMiddleware: () => middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Error
> = () => {
  return {
    before: (
      request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error>
    ) => {
      const netlifyHeader = request.event.headers['X-Netlify-Host'];
      if (
        netlifyHeader === null ||
        netlifyHeader === undefined ||
        netlifyHeader !== 'smarter-menu-netlify'
      ) {
        return apiResponse._403();
      }
    },
  };
};
