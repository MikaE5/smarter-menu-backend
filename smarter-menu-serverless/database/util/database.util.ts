import {
  DeleteItemInput,
  GetItemInput,
  PutItemInput,
  QueryInput,
  ScanInput,
} from 'aws-sdk/clients/dynamodb';
import {
  SMARTER_MENU_ANALYTICS_DB_NAME,
  SMARTER_MENU_ANALYTICS_DB_PARTITION_KEY,
  SMARTER_MENU_ANALYTICS_DB_SORT_KEY,
  SMARTER_MENU_DB_NAME,
  SMARTER_MENU_DB_PARTITION_KEY,
  SMARTER_MENU_DB_SORT_KEY,
  SMARTER_MENU_USER_DB_NAME,
  SMARTER_MENU_USER_DB_PARTITION_KEY,
} from '../../config';
import { DocumentType } from '../../functions/model/document.interface';

export const getAllTypeForCustomerQuery = (
  customer: string,
  type: string
): QueryInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    KeyConditionExpression: `${SMARTER_MENU_DB_PARTITION_KEY} = :customer and begins_with(${SMARTER_MENU_DB_SORT_KEY}, :type)`,
    ExpressionAttributeValues: {
      ':customer': customer,
      ':type': type,
    },
  } as QueryInput;
};

export const getAllWishlistsForCustomerQuery = (
  customer: string
): QueryInput => {
  return {
    TableName: SMARTER_MENU_ANALYTICS_DB_NAME,
    KeyConditionExpression: `${SMARTER_MENU_ANALYTICS_DB_PARTITION_KEY} = :customer and begins_with(${SMARTER_MENU_ANALYTICS_DB_SORT_KEY}, :type)`,
    ExpressionAttributeValues: {
      ':customer': customer,
      ':type': DocumentType.WISHLIST,
    },
  } as QueryInput;
};

export const getPageConfigsQuery = (): ScanInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    FilterExpression: `begins_with(${SMARTER_MENU_DB_SORT_KEY}, :page)`,
    ExpressionAttributeValues: {
      ':page': 'page-config',
    },
  } as ScanInput;
};

export const getUserQuery = (username: string): GetItemInput => {
  return {
    TableName: SMARTER_MENU_USER_DB_NAME,
    Key: {
      [SMARTER_MENU_USER_DB_PARTITION_KEY]: username,
    },
  } as GetItemInput;
};

export const getAllForCustomerQuery = (customer: string): QueryInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    KeyConditionExpression: `${SMARTER_MENU_DB_PARTITION_KEY} = :customer`,
    ExpressionAttributeValues: {
      ':customer': customer,
    },
  } as QueryInput;
};

export const getPutItemQuery = (
  dbName: string,
  document: object
): PutItemInput => {
  return {
    TableName: dbName,
    Item: document,
  } as PutItemInput;
};

export const getDeleteItemQuery = (
  id: string,
  customer: string
): DeleteItemInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    Key: {
      [SMARTER_MENU_DB_PARTITION_KEY]: customer,
      [SMARTER_MENU_DB_SORT_KEY]: id,
    },
  } as DeleteItemInput;
};
