import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { apiResponse } from '../util/api-response.util';
import { getBody } from '../util/api-request.util';
import { getDatabase } from '../database/database';
import { getUserQuery } from '../database/util/database.util';
import { createToken, isValidPassword } from './util/auth.util';
import { StoredPassword, User } from './model/user.interface';

const login = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  const username: string = body['username'];
  const password: string = body['password'];
  if (username === undefined || password === undefined) {
    return apiResponse._400();
  }

  try {
    const userData = await getDatabase().get(getUserQuery(username)).promise();
    if (userData.Item === undefined) {
      return apiResponse._403();
    }

    const user: User = userData.Item as User;

    const storedPassword: StoredPassword = user.password;

    if (
      storedPassword === undefined ||
      storedPassword.hash === undefined ||
      storedPassword.salt === undefined ||
      storedPassword.iterations === undefined
    ) {
      return apiResponse._403();
    }

    const validPassword: boolean = isValidPassword(password, storedPassword);

    if (!validPassword) {
      return apiResponse._403();
    }

    return apiResponse._200({
      token: createToken({
        customer: user.customer_id,
      }),
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(login).use(httpErrorHandler());
