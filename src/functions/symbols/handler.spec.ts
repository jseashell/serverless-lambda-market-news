import { Context } from 'aws-lambda';
import axios from 'axios';
import { main, supportedExchanges } from './handler';
import { Symbol, SymbolsQueryParams } from './symbols.interface';

describe('symbols', () => {
  const mockEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
      exchange: 'US',
    } as SymbolsQueryParams,
  };

  const mockData: Symbol[] = [
    {
      currency: 'USD',
      description: 'UAN POWER CORP',
      displaySymbol: 'UPOW',
      figi: 'BBG000BGHYF2',
      mic: 'OTCM',
      symbol: 'UPOW',
      type: 'Common Stock',
    },
    {
      currency: 'USD',
      description: 'APPLE INC',
      displaySymbol: 'AAPL',
      figi: 'BBG000B9Y5X2',
      mic: 'XNGS',
      symbol: 'AAPL',
      type: 'Common Stock',
    },
    {
      currency: 'USD',
      description: 'EXCO TECHNOLOGIES LTD',
      displaySymbol: 'EXCOF',
      figi: 'BBG000JHDDS8',
      mic: 'OOTC',
      symbol: 'EXCOF',
      type: 'Common Stock',
    },
  ];

  it('should return a list of symbols with statusCode 200', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: mockData,
    });

    const response = await main(mockEvent, mockContext);

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify({ data: mockData }),
      })
    );
  });

  it('should log errors and return statusCode 500', async () => {
    const errorLog = jest.fn();
    console.error = errorLog;
    jest.spyOn(axios, 'get').mockRejectedValue({});

    const response = await main(mockEvent, mockContext);

    expect(response.statusCode).toBe(500);
    expect(errorLog).toHaveBeenCalled();
  });

  it('should return statusCode 400 when an invalid exchange is queried', async () => {
    const get = jest.fn();
    jest.spyOn(axios, 'get').mockImplementation(get);

    const invalidExchange = 'invalid';

    const invalidSymbolsEvent = {
      ...mockEvent,
      queryStringParameters: {
        exchange: invalidExchange,
      },
    };

    const response = await main(invalidSymbolsEvent, mockContext);

    expect(get).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: `Invalid exchange ${invalidExchange}. Valid values are [${supportedExchanges.join(',')}]`,
      })
    );
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
