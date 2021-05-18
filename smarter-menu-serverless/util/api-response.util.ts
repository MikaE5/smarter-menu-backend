import { APIGatewayProxyResult } from 'aws-lambda';

interface ApiResponse {
  _403: () => APIGatewayProxyResult;
  _400: () => APIGatewayProxyResult;
  _200: (body: object) => APIGatewayProxyResult;
  _500: () => APIGatewayProxyResult;
}

export const apiResponse: ApiResponse = {
  _500: () => {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: 'Internal Server Error',
      }),
    };
  },
  _400: () => {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: 'Bad Request',
      }),
    };
  },
  _403: () => {
    return {
      statusCode: 403,
      body: JSON.stringify({
        msg: 'Forbidden',
      }),
    };
  },
  _200: (body: object) => {
    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  },
};
