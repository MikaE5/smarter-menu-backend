export interface Document {
  id: string;
  customer_id: string;
  updatedAt?: string;
  disabled?: boolean;
}

export enum DocumentType {
  CATEGORY = 'category',
  ITEM = 'item',
  ALLERGEN = 'allergen',
  CLASSIFICATION = 'classification',
  PAGE_CONFIG = 'page-config',
  WISHLIST = 'wishlist',
}
