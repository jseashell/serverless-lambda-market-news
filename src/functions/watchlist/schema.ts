export default {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    stocks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
          },
        },
        required: ['symbol'],
      },
    },
    coins: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
          },
        },
        required: ['symbol'],
      },
    },
  },
  required: ['userId', 'stocks', 'coins'],
} as const;
