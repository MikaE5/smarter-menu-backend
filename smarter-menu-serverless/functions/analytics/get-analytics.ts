import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDatabase } from '../../database/database';
import { getAllWishlistsForCustomerQuery } from '../../database/util/database.util';
import { getBody } from '../../util/api-request.util';
import { apiResponse } from '../../util/api-response.util';
import { isThisMonth, isThisWeek, isToday } from '../../util/date.util';
import { verifyToken } from '../util/auth.util';
import { isDefinedString } from '../util/validate-body.util';
import {
  Wishlist,
  WishlistAnalyticsEntry,
  WishlistEntry,
} from './model/wishlist.interface';

const getAnalytics = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = getBody(event.body);

  const token: string = body['token'];
  //const customerId = body['customer_id'];

  if (!isDefinedString(token)) {
    return apiResponse._400();
  }

  const { valid, customer } = verifyToken(token);

  if (!valid || customer === undefined) {
    return apiResponse._401();
  }

  try {
    const items = await getDatabase()
      .query(getAllWishlistsForCustomerQuery(customer))
      .promise();

    const wishlists: Wishlist[] = items.Items
      ? (items.Items as Wishlist[])
      : [];

    const today = new Date();

    const itemAnalyticsMap: {
      [itemId: string]: { [categoryId: string]: WishlistAnalyticsEntry };
    } = {};

    const addToMap = (
      wishlistEntry: WishlistEntry,
      wishlistEntryDate: Date
    ) => {
      const addAnalyticsEntry: WishlistAnalyticsEntry = {
        item_id: wishlistEntry.item_id,
        category_id: wishlistEntry.category_id,
        all_time: 1,
        this_month: isThisMonth(today, wishlistEntryDate) ? 1 : 0,
        this_week: isThisWeek(today, wishlistEntryDate) ? 1 : 0,
        today: isToday(today, wishlistEntryDate) ? 1 : 0,
      };

      if (
        itemAnalyticsMap[wishlistEntry.item_id] === undefined ||
        itemAnalyticsMap[wishlistEntry.item_id][wishlistEntry.category_id] ===
          undefined
      ) {
        itemAnalyticsMap[wishlistEntry.item_id] = {
          [wishlistEntry.category_id]: addAnalyticsEntry,
        };
        return;
      }

      const mapEntry =
        itemAnalyticsMap[wishlistEntry.item_id][wishlistEntry.category_id];

      mapEntry.all_time += addAnalyticsEntry.all_time;
      mapEntry.this_month += addAnalyticsEntry.this_month;
      mapEntry.this_week += addAnalyticsEntry.this_week;
      mapEntry.today += addAnalyticsEntry.today;
    };

    wishlists.forEach((wishlist: Wishlist) => {
      const wishlistDate = new Date(wishlist.created_at);
      wishlist.wishlist.forEach((entry: WishlistEntry) =>
        addToMap(entry, wishlistDate)
      );
    });

    const categoryMaps: Array<{
      [categoryId: string]: WishlistAnalyticsEntry;
    }> = Object.values(itemAnalyticsMap);
    const wishlistAnalytics: WishlistAnalyticsEntry[] = [];
    categoryMaps.forEach((categoryMap) => {
      wishlistAnalytics.push(...Object.values(categoryMap));
    });

    return apiResponse._200({
      data: wishlistAnalytics,
    });
  } catch (error) {
    console.log(error);
    return apiResponse._500();
  }
};

export const handler = middy(getAnalytics).use(httpErrorHandler());
