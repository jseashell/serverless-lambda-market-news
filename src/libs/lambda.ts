import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { AWS } from '@serverless/typescript';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};

export type AwsFunction = AWS['functions'][0];
