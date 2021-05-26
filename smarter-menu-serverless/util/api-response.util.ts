import { APIGatewayProxyResult } from 'aws-lambda';

interface ApiResponse {
  _403: () => APIGatewayProxyResult;
  _400: () => APIGatewayProxyResult;
  _401: () => APIGatewayProxyResult;
  _200: (body: object) => APIGatewayProxyResult;
  _500: () => APIGatewayProxyResult;
}

export const apiResponse: ApiResponse = {
  _500: () => {
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        msg: 'Internal Server Error',
      }),
    };
  },
  _400: () => {
    return {
      statusCode: 400,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        msg: 'Bad Request',
      }),
    };
  },
  _401: () => {
    return {
      statusCode: 401,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        msg: 'Unauthorized',
      }),
    };
  },
  _403: () => {
    return {
      statusCode: 403,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        msg: 'Forbidden',
      }),
    };
  },
  _200: (body: object) => {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  },
};
