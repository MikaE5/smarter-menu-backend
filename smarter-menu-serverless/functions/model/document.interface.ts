export interface Document {
  id: string;
  customer_id: string;
}

export enum DocumentType {
  CATEGORY = 'category',
  ITEM = 'item',
  ALLERGEN = 'allergen',
  CLASSIFICATION = 'classification',
  PAGE_CONFIG = 'page-config',
}
