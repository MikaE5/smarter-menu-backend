import { Document } from '../model/document.interface';

export const removePageConfig = (docs: Document[]): Document[] =>
  docs.filter(({ id }) => !id.startsWith('page-config'));
