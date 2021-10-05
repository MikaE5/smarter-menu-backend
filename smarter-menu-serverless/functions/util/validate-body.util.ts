const isDefined = (val: any) => val !== undefined && val !== null;

export const isDefinedArray = (arr: any): boolean => {
  return isDefined(arr) && Array.isArray(arr);
};

export const isDefinedString = (str: any): boolean => {
  return isDefined(str) && typeof str === 'string';
};
