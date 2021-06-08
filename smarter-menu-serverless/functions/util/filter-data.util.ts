import { Document } from '../model/document.interface';

export const removePageConfig = (docs: Document[]): Document[] =>
  docs.filter(({ id }) => !id.startsWith('page-config'));

export const removeDisabledDocs = (docs: Document[]): Document[] => {
  return docs.filter(
    (doc) => doc.disabled === undefined || doc.disabled === false
  );
};
