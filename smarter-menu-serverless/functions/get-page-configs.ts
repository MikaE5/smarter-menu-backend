import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../util/api-response.util';
import { getDatabase } from '../database/database';
import { getPageConfigsQuery } from '../database/util/database.util';

const getPageConfigs = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const pageConfigs = await getDatabase()
      .scan(getPageConfigsQuery())
      .promise();
    return apiResponse._200({
      data: pageConfigs.Items ? pageConfigs.Items : [],
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(getPageConfigs)
  .use(headerMiddleware())
  .use(httpErrorHandler());
