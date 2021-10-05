import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { apiResponse } from '../util/api-response.util';
import { getBody } from '../util/api-request.util';
import { getDatabase } from '../database/database';
import { verifyToken } from './util/auth.util';
import { getPutItemQuery } from '../database/util/database.util';
import { Document } from './model/document.interface';
import { getNewIdForTypeSafe } from './util/document-id.util';
import { SMARTER_MENU_DB_NAME } from '../config';
import { isDefinedString } from './util/validate-body.util';

const updateDocument = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  const token: string = body['token'];
  const document: Document = body['data'];
  const documentType = body['document_type'];

  const missingId: boolean = document ? document.id === undefined : true;

  const invalidRequestWithMissingDocId =
    missingId && documentType === undefined;

  if (
    !isDefinedString(token) ||
    document === undefined ||
    invalidRequestWithMissingDocId
  ) {
    return apiResponse._400();
  }

  const { valid, customer } = verifyToken(token);

  if (!valid || customer === undefined) {
    return apiResponse._401();
  }

  const documentToUpload: Document = document;
  if (missingId) {
    const id = getNewIdForTypeSafe(documentType, customer);
    if (id === undefined) {
      return apiResponse._400();
    }
    documentToUpload.id = id;
  }
  documentToUpload.customer_id = customer;
  document.updatedAt = new Date().toISOString();

  documentToUpload.customer_id = customer;

  try {
    await getDatabase()
      .put(getPutItemQuery(SMARTER_MENU_DB_NAME, documentToUpload))
      .promise();

    return apiResponse._200({
      msg: 'okay',
      document: documentToUpload,
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(updateDocument).use(httpErrorHandler());
