import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { apiResponse } from '../util/api-response.util';
import { getBody } from '../util/api-request.util';
import { getDatabase } from '../database/database';
import { verifyToken } from './util/auth.util';
import { getAllForCustomerQuery } from '../database/util/database.util';
import { removePageConfig } from './util/filter-data.util';
import { Document } from './model/document.interface';

const getAllForCustomer = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  const token: string = body['token'];

  if (token === undefined) {
    return apiResponse._400();
  }

  const { valid, customer } = verifyToken(token);

  if (!valid || customer === undefined) {
    return apiResponse._401();
  }

  try {
    const data = await getDatabase()
      .query(getAllForCustomerQuery(customer))
      .promise();

    return apiResponse._200({
      data: data.Items ? removePageConfig(data.Items as Document[]) : [],
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(getAllForCustomer).use(httpErrorHandler());
