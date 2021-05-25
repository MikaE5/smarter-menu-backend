import { GetItemInput, QueryInput, ScanInput } from 'aws-sdk/clients/dynamodb';
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

export const getPageConfigsQuery = (): ScanInput => {
  return {
    TableName: SMARTER_MENU_DB_NAME,
    FilterExpression: `begins_with(${SMARTER_MENU_DB_SORT_KEY}, :page)`,
    ExpressionAttributeValues: {
      ':page': 'page-config',
    },
  } as ScanInput;
};
