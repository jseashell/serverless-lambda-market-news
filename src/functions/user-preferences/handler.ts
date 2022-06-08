import {
  DeleteItemCommand,
  DeleteItemCommandOutput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const userPreferences: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
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

  const command = new PutItemCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Item: {
      userId: {
        S: event.body.userId,
      },
      stocks: {
        L: event.body.stocks,
      },
      coins: {
        L: event.body.coins,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  return client
    .send(command)
    .then((output: PutItemCommandOutput) => {
      return formatJSONResponse({
        message: 'Success',
        data: output.Attributes,
      });
    })
    .catch((error) => {
      console.error('PutItem', error);
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

  const command = new GetItemCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: {
        S: event.queryStringParameters.userId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  return client
    .send(command)
    .then((output: GetItemCommandOutput) => {
      return formatJSONResponse({
        message: 'Success',
        preferences: output.Item || {},
      });
    })
    .catch((error) => {
      console.error('GetItem', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}

async function handlePatch(event) {
  console.debug('POST', { type: typeof event.body, body: event.body });

  const command = new UpdateItemCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: event.body.userId,
    },
    UpdateExpression: 'set stocks = :s, coins = :c',
    ExpressionAttributeValues: {
      ':s': {
        L: event.body.stocks,
      },
      ':c': {
        L: event.body.coins,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  return client
    .send(command)
    .then((_output: DeleteItemCommandOutput) => {
      return formatJSONResponse({
        message: 'Success',
      });
    })
    .catch((error) => {
      console.error('UpdateItem', error);
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

  const command = new DeleteItemCommand({
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: {
        S: event.queryStringParameters.userId,
      },
    },
  });

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  return client
    .send(command)
    .then((_output: DeleteItemCommandOutput) => {
      return formatJSONResponse({
        message: 'Success',
      });
    })
    .catch((error) => {
      console.error('DeleteItem', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error', ...error }),
      };
    });
}
