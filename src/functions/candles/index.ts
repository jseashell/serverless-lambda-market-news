import { handlerPath } from '@libs/handler-resolver';
import { AwsFunction } from '@libs/lambda';

const path = 'candles';
const cors = true;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: path,
        cors: cors,
        request: {
          parameters: {
            querystrings: {
              symbol: true,
              resolution: true,
              from: true,
              to: true,
            },
          },
        },
      },
    },
  ],
} as AwsFunction;
