import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';

import { headerMiddleware } from '../../middleware/header.middleware';
import { getBody } from '../../util/api-request.util';
import { getDatabase } from '../../database/database';
import { apiResponse } from '../../util/api-response.util';
import { verifyConnectionKey } from '../util/auth.util';
import { Wishlist, WishlistEntry } from './model/wishlist.interface';
import { isDefinedArray, isDefinedString } from '../util/validate-body.util';
import { getNewIdForType } from '../util/document-id.util';
import { DocumentType } from '../model/document.interface';
import { SMARTER_MENU_ANALYTICS_DB_NAME } from '../../config';
import { getPutItemQuery } from '../../database/util/database.util';

const postWishlist = async (event: APIGatewayProxyEvent) => {
  const body = getBody(event.body);

  if (!verifyConnectionKey(body['connection_key'])) {
    return apiResponse._401();
  }

  let wishlistEntries: WishlistEntry[] = body['bookmarks'];
  const customer_id: string = body['customer_id'];

  if (!isDefinedString(customer_id) || !isDefinedArray(wishlistEntries)) {
    return apiResponse._400();
  }

  wishlistEntries = wishlistEntries.map(({ item_id, category_id }) => {
    return {
      item_id,
      category_id,
    };
  });

  const wishlist: Wishlist = {
    id: getNewIdForType(DocumentType.WISHLIST, customer_id),
    customer_id,
    wishlist: wishlistEntries,
    created_at: new Date().toISOString(),
  };

  try {
    await getDatabase()
      .put(getPutItemQuery(SMARTER_MENU_ANALYTICS_DB_NAME, wishlist))
      .promise();

    return apiResponse._200({
      msg: 'okay',
      document: wishlist,
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(postWishlist)
  .use(headerMiddleware())
  .use(httpErrorHandler());
