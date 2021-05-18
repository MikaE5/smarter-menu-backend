import { GetItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import {
  SMARTER_MENU_DB_NAME,
  SMARTER_MENU_DB_PARTITION_KEY,
  SMARTER_MENU_DB_SORT_KEY,
} from '../../config';

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

export const getPageContentForCustomer = (customer: string): GetItemInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    Key: {
      [SMARTER_MENU_DB_PARTITION_KEY]: customer,
      [SMARTER_MENU_DB_SORT_KEY]: `page-config/${customer}`,
    },
  } as GetItemInput;
};
