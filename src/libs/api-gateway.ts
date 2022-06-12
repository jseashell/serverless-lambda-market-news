import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'OPTIONS, POST, GET, PATCH, DELETE',
};

type ValidatedApiGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventApiGatewayProxyEvent<S> = Handler<ValidatedApiGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJsonResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(response),
  };
};

export const formatServerError = (errorMessage: string) => {
  return {
    statusCode: 500,
    headers: headers,
    body: errorMessage,
  };
};

export const formatClientError = (errorMessage: string) => {
  return {
    statusCode: 400,
    headers: headers,
    body: errorMessage,
  };
};
