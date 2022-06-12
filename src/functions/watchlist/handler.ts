import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { formatJsonResponse, formatServerError, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const watchlist: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  switch (event.httpMethod) {
    case 'POST':
      return handlePost(event);
    case 'GET':
      return handleGet(event);
    case 'PATCH':
      return handlePatch(event);
    case 'DELETE':
      return handleDelete(event);
    default:
      return formatServerError(`${event.httpMethod} is not being handled!`);
  }
};

export const main = middyfy(watchlist);

async function handlePost(event) {
  console.debug('POST', { type: typeof event.body, body: event.body });

  const command = new PutCommand({
    TableName: process.env.USER_WATCHLIST_TABLE,
    Item: event.body,
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((output: PutCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
        data: output.Attributes || null,
      });
    })
    .catch((error) => {
      console.error('PutCommand', error);
      return formatServerError(JSON.stringify({ message: 'Error', ...error }));
    });
}

async function handleGet(event) {
  console.debug('GET', {
    type: typeof event.queryStringParameters,
    queryStringParameters: event.queryStringParameters,
  });

  const command = new GetCommand({
    TableName: process.env.USER_WATCHLIST_TABLE,
    Key: {
      userId: event.queryStringParameters.userId,
    },
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((output: GetCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
        data: output.Item || null,
      });
    })
    .catch((error) => {
      console.error('GetCommand', error);
      return formatServerError(JSON.stringify({ message: 'Error', ...error }));
    });
}

async function handlePatch(event) {
  console.debug('PATCH', { type: typeof event.body, body: event.body });

  const command = new UpdateCommand({
    TableName: process.env.USER_WATCHLIST_TABLE,
    Key: {
      userId: event.body.userId,
    },
    UpdateExpression: 'set stocks = :s, coins = :c',
    ExpressionAttributeValues: {
      ':s': event.body.stocks,
      ':c': event.body.coins,
    },
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((output: UpdateCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
        data: output.Attributes || null,
      });
    })
    .catch((error) => {
      console.error('UpdateCommand', error);
      return formatServerError(JSON.stringify({ message: 'Error', ...error }));
    });
}

async function handleDelete(event) {
  console.debug('DELETE', {
    type: typeof event.queryStringParameters,
    queryStringParameters: event.queryStringParameters,
  });

  const command = new DeleteCommand({
    TableName: process.env.USER_WATCHLIST_TABLE,
    Key: {
      userId: event.queryStringParameters.userId,
    },
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((output: DeleteCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
        data: output.Attributes || null,
      });
    })
    .catch((error) => {
      console.error('DeleteCommand', error);
      return formatServerError(JSON.stringify({ message: 'Error', ...error }));
    });
}
