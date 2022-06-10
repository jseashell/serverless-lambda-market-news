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
import { formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const userPreferences: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
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
      return {
        statusCode: 500,
        body: `${event.httpMethod} is not being handled!`,
      };
  }
};

export const main = middyfy(userPreferences);

async function handlePost(event) {
  console.debug('POST', { type: typeof event.body, body: event.body });

  const command = new PutCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Item: event.body,
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((output: PutCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
        data: output.Attributes,
      });
    })
    .catch((error) => {
      console.error('PutCommand', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}

async function handleGet(event) {
  console.debug('GET', {
    type: typeof event.queryStringParameters,
    queryStringParameters: event.queryStringParameters,
  });

  const command = new GetCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
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
        preferences: output.Item || {},
      });
    })
    .catch((error) => {
      console.error('GetCommand', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}

async function handlePatch(event) {
  console.debug('POST', { type: typeof event.body, body: event.body });

  const command = new UpdateCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
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
    .then((_output: UpdateCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
      });
    })
    .catch((error) => {
      console.error('UpdateCommand', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}

async function handleDelete(event) {
  console.debug('GET', {
    type: typeof event.queryStringParameters,
    queryStringParameters: event.queryStringParameters,
  });

  const command = new DeleteCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: event.queryStringParameters.userId,
    },
  });

  const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  return ddb
    .send(command)
    .then((_output: DeleteCommandOutput) => {
      return formatJsonResponse({
        message: 'Success',
      });
    })
    .catch((error) => {
      console.error('DeleteCommand', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}
