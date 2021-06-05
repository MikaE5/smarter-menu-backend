import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { apiResponse } from '../util/api-response.util';
import { getBody } from '../util/api-request.util';
import { getDatabase } from '../database/database';
import { verifyToken } from './util/auth.util';
import { getDeleteItemQuery } from '../database/util/database.util';

const deleteDocument = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  const token: string = body['token'];
  const id: string = body['id'];

  if (token === undefined || id === undefined) {
    return apiResponse._400();
  }

  const { valid, customer } = verifyToken(token);

  if (!valid || customer === undefined) {
    return apiResponse._401();
  }

  try {
    await getDatabase().delete(getDeleteItemQuery(id, customer)).promise();
    return apiResponse._200({
      msg: 'okay',
      deleted: true,
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(deleteDocument).use(httpErrorHandler());
