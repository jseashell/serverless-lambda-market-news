import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { main } from './handler';

const ddbMock = mockClient(DynamoDBDocumentClient);

jest.mock('@middy/core', () => {
  return (handler: Handler) => {
    return {
      use: jest.fn().mockReturnValue(handler),
    };
  };
});

describe('main', () => {
  beforeEach(() => {
    ddbMock.reset();
    console.debug = jest.fn();
    console.error = jest.fn();
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

      // @ts-ignore
      const response = await main(mockPostEvent);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(PutCommand).rejects();

      // @ts-ignore
      const response = await main(mockPostEvent);

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

      // @ts-ignore
      const response = await main(mockGetEvent);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(GetCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(GetCommand).rejects();

      // @ts-ignore
      const response = await main(mockGetEvent);

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

      // @ts-ignore
      const response = await main(mockPatchEvent);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(UpdateCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(UpdateCommand).rejects();

      // @ts-ignore
      const response = await main(mockPatchEvent);

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

      // @ts-ignore
      const response = await main(mockDeleteEvent);

      expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });

    it('should return statusCode 500 for error', async () => {
      ddbMock.on(DeleteCommand).rejects();

      // @ts-ignore
      const response = await main(mockDeleteEvent);

      expect(response).toEqual(expect.objectContaining({ statusCode: 500 }));
      expect(ddbMock.commandCalls(DeleteCommand).length).toBe(1);
    });
  });
});
