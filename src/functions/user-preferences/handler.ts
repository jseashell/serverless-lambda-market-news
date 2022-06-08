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
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  const params = {
    TableName: process.env.USER_PREFERENCES_TABLE,
    Item: event.body,
  };

  const command = new PutItemCommand(params);

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
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  const params = {
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: {
        S: event.queryStringParameters.userId,
      },
    },
  };

  const command = new GetItemCommand(params);

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
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  const params = {
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: event.body.userId,
    },
    UpdateExpression: 'set stocks = :s, coins = :c',
    ExpressionAttributes: {
      ':s': JSON.stringify(event.body.stocks),
      ':c': JSON.stringify(event.body.coins),
    },
  };

  const command = new UpdateItemCommand(params);

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
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  const params = {
    TableName: process.env.USER_PREFERENCES_TABLE,
    Key: {
      userId: {
        S: event.queryStringParameters.userId,
      },
    },
  };

  const command = new DeleteItemCommand(params);

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
