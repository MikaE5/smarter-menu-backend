export const getBody = (body: string | null | undefined): object => {
  return body === null || body == undefined ? {} : JSON.parse(body);
};
