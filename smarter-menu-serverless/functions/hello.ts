import { APIGatewayProxyEvent } from 'aws-lambda';

export const hello = async (event: APIGatewayProxyEvent) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify({ msg: 'Hello from smarter-menu!' }),
  };
};
