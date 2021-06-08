import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDatabase } from '../../database/database';
import { getAllTypeForCustomerQuery } from '../../database/util/database.util';
import { getBody } from '../../util/api-request.util';
import { apiResponse } from '../../util/api-response.util';
import { Document } from '../model/document.interface';
import { removeDisabledDocs } from './filter-data.util';

export const baseGetAll = (
  type: string,
  filterDisabled = false
): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) => {
  return async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    const body = getBody(event.body);

    const customerId = body['customer_id'];
    if (customerId === undefined) {
      return apiResponse._400();
    }

    try {
      const items = await getDatabase()
        .query(getAllTypeForCustomerQuery(customerId, type))
        .promise();

      const docs: Document[] = items.Items ? (items.Items as Document[]) : [];
      return apiResponse._200({
        data: filterDisabled ? removeDisabledDocs(docs) : docs,
      });
    } catch (error) {
      return apiResponse._500();
    }
  };
};
