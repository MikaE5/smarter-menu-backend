import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDatabase } from '../../database/database';
import { getAllTypeForCustomerQuery } from '../../database/util/database.util';
import { getBody } from '../../util/api-request.util';
import { apiResponse } from '../../util/api-response.util';

export const baseGetAll = (
  type: string
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
      return apiResponse._200({
        data: items.Items ? items.Items : [],
      });
    } catch (error) {
      console.log(error);
      return apiResponse._500();
    }
  };
};
