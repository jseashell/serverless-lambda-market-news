import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'preferences',
        cors: true,
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
        path: 'preferences',
        cors: true,
      },
    },
    {
      http: {
        method: 'put',
        path: 'preferences',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
    {
      http: {
        method: 'patch',
        path: 'preferences',
        cors: true,
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
        path: 'preferences',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
