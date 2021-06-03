import { v4 as uuidv4 } from 'uuid';
import { DocumentType } from '../model/document.interface';

export const getNewIdForType = (
  type: DocumentType,
  customerId: string
): string | undefined => {
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
    default:
      docType = undefined;
      break;
  }

  if (docType === undefined) {
    return undefined;
  }

  return `${docType}/${customerId}/${id}`;
};
