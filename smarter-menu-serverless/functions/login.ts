import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { apiResponse } from '../util/api-response.util';
import { getBody } from '../util/api-request.util';
import { getDatabase } from '../database/database';
import { getUserQuery } from '../database/util/database.util';
import { createToken, isValidPassword } from './util/auth.util';

const login = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  const customerId: string = body['customer_id'];
  const password: string = body['password'];
  if (customerId === undefined || password === undefined) {
    return apiResponse._400();
  }

  try {
    const user = await getDatabase().get(getUserQuery(customerId)).promise();
    if (user.Item === undefined) {
      return apiResponse._403();
    }
    const hashedPassword: string = user.Item.password;

    if (hashedPassword === undefined) {
      return apiResponse._403();
    }

    const validPassword: boolean = await isValidPassword(
      password,
      hashedPassword
    );

    if (!validPassword) {
      return apiResponse._403();
    }

    return apiResponse._200({
      token: createToken({
        user: customerId,
      }),
    });
  } catch (error) {
    return apiResponse._500();
  }
};

export const handler = middy(login).use(httpErrorHandler());
