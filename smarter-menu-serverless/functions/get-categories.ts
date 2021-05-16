import { APIGatewayProxyEvent } from 'aws-lambda';
import { QueryInput, DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new DocumentClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.queryStringParameters === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: 'Bad Request.',
      }),
    };
  }

  const customerId = event.queryStringParameters['customer-id'];

  if (
    customerId === null ||
    customerId === undefined ||
    customerId !== 'smarter-menu'
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: 'Not allowed.' }),
    };
  }

  const input: QueryInput = {
    TableName: 'smarter-menu-categories',
    KeyConditionExpression: 'customer_id = :value',
    ExpressionAttributeValues: {
      ':value': 'smarter-menu',
    },
  } as QueryInput;

  try {
    const test = await dynamoDb.query(input).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        results: test.Items,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: 'Something went wrong.',
      }),
    };
  }
};
