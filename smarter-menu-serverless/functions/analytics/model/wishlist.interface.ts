import { Document } from '../../model/document.interface';

export interface WishlistEntry {
  item_id: string;
  category_id: string;
}

export interface Wishlist extends Document {
  wishlist: WishlistEntry[];
  created_at: string;
}

export interface WishlistAnalyticsEntry extends WishlistEntry {
  all_time: number;
  this_month: number;
  this_week: number;
  today: number;
}
