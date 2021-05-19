import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { headerMiddleware } from '../middleware/header.middleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../util/api-response.util';
import { getDatabase } from '../database/database';
import { getPageContentForCustomer } from '../database/util/database.util';
import { getBody } from '../util/api-request.util';

const getPageConfig = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = getBody(event.body);

  const customerId = body['customer_id'];
  if (customerId === undefined) {
    return apiResponse._400();
  }

  try {
    const pageContent = await getDatabase()
      .get(getPageContentForCustomer(customerId))
      .promise();
    return apiResponse._200({
      data: pageContent.Item ? pageContent.Item : undefined,
    });
  } catch (error) {
    return apiResponse._500();
  }
};

export const handler = middy(getPageConfig)
  .use(headerMiddleware())
  .use(httpErrorHandler());
