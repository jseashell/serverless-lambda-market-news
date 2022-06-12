import { handlerPath } from '@libs/handler-resolver';
import { AwsFunction } from '@libs/lambda';

const path = 'symbols';
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
              exchange: true,
            },
          },
        },
      },
    },
  ],
} as AwsFunction;
