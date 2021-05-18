import { DocumentClient } from 'aws-sdk/clients/dynamodb';

let dynamoDb: DocumentClient;
export const getDatabase = (): DocumentClient => {
  if (dynamoDb === undefined) {
    dynamoDb = new DocumentClient();
  }
  return dynamoDb;
};
