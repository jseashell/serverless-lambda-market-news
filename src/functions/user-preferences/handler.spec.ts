import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { main } from './handler';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('userPreferences', () => {
  beforeEach(() => {
    ddbMock.reset();
    console.debug = jest.fn();
    console.error = jest.fn();
  });

  it('should return statusCode 500 for an unhandled http method', async () => {
    const mockEvent = {
      httpMethod: 'NOT-REAL',
    };

    const response = await main(mockEvent, mockContext);

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 500,
        body: `${mockEvent.httpMethod} is not being handled!`,
      })
    );
  });

  describe('handlePost', () => {
    const mockPostEvent = {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'example-id-000',
        stocks: [{ symbol: 'AAPL' }],
        coins: [{ symbol: 'BINANCE:BTCUSDT' }],
      }),
    };

    it('should return statusCode 200 for successful PutCommand', async () => {
      ddbMock.on(PutCommand).resolves({});

      const response = await main(mockPostEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(PutCommand).rejects();

      const response = await main(mockPostEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 500 }));
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });
  });

  describe('handleGet', () => {
    const mockGetEvent = {
      httpMethod: 'GET',
      queryStringParameters: {
        userId: 'example-id-000',
      },
    };

    it('should return statusCode 200 for successful GetCommand', async () => {
      ddbMock.on(GetCommand).resolves({});

      const response = await main(mockGetEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(GetCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(GetCommand).rejects();

      const response = await main(mockGetEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 500 }));
      expect(ddbMock.commandCalls(GetCommand).length).toBe(1);
    });
  });

  describe('handlePatch', () => {
    const mockPatchEvent = {
      httpMethod: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'example-id-000',
        stocks: [{ symbol: 'AAPL' }],
        coins: [{ symbol: 'BINANCE:BTCUSDT' }],
      }),
    };

    it('should return statusCode 200 for successful UpdateCommand', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      const response = await main(mockPatchEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(UpdateCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(UpdateCommand).rejects();

      const response = await main(mockPatchEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 500 }));
      expect(ddbMock.commandCalls(UpdateCommand).length).toBe(1);
    });
  });

  describe('handleDelete', () => {
    const mockDeleteEvent = {
      httpMethod: 'DELETE',
      queryStringParameters: {
        userId: 'example-id-000',
      },
    };

    it('should return statusCode 200 for successful DeleteCommand', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      const response = await main(mockDeleteEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(DeleteCommand).rejects();

      const response = await main(mockDeleteEvent, mockContext);

      expect(response).toEqual(expect.objectContaining({ statusCode: 500 }));
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });
  });
});

const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: jest.fn(),
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
};
