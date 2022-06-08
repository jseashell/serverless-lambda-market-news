import { handlerPath } from '@libs/handler-resolver';
import { AwsFunction } from '@libs/lambda';
import schema from './schema';

const path = 'preferences';
const cors = true;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: path,
        cors: cors,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
    {
      http: {
        method: 'get',
        path: path,
        cors: cors,
        request: {
          parameters: {
            querystrings: {
              userId: true,
            },
          },
        },
      },
    },
    {
      http: {
        method: 'patch',
        path: path,
        cors: cors,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
    {
      http: {
        method: 'delete',
        path: path,
        cors: cors,
        request: {
          parameters: {
            querystrings: {
              userId: true,
            },
          },
        },
      },
    },
  ],
} as AwsFunction;
