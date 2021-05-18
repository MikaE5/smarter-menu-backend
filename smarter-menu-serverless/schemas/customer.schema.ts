export const CustomerSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        customer_id: { type: 'string' },
      },
      required: ['customer_id'],
    },
  },
};
