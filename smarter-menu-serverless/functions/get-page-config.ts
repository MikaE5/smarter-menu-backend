import middy from '@middy/core';
import validator from '@middy/validator';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import { headerMiddleware } from '../middleware/header.middleware';
import { CustomerSchema } from '../schemas/customer.schema';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../util/api-response.util';
import { getDatabase } from '../database/database';
import { getPageContentForCustomer } from '../database/util/database.util';

const getPageConfig = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const customerId = event.body?.['customer_id'];
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
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema: CustomerSchema,
    })
  )
  .use(httpErrorHandler());
