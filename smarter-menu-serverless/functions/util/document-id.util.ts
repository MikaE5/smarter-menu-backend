import { v4 as uuidv4 } from 'uuid';
import { DocumentType } from '../model/document.interface';

export const getNewIdForType = (
  type: DocumentType,
  customerId: string
): string => {
  if (type === DocumentType.PAGE_CONFIG) {
    return `page-config/${customerId}`;
  }

  const id = uuidv4();

  let docType: string | undefined;
  switch (type) {
    case DocumentType.CATEGORY:
      docType = 'category';
      break;
    case DocumentType.ITEM:
      docType = 'item';
      break;
    case DocumentType.CLASSIFICATION:
      docType = 'meta/classification';
      break;
    case DocumentType.ALLERGEN:
      docType = 'meta/allergen';
      break;
    case DocumentType.WISHLIST:
      docType = 'wishlist';
    default:
      docType = 'missing-doc-type';
      break;
  }

  return `${docType}/${customerId}/${id}`;
};

export const getNewIdForTypeSafe = (
  type: DocumentType,
  customerId: string
): string | undefined => {
  const id = getNewIdForType(type, customerId);

  return id.startsWith('missing-doc-type') ? undefined : id;
};
