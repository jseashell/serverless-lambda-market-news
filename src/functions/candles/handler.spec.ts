import { Context } from 'aws-lambda';
import axios from 'axios';
import { Candles, CandlesQueryParams } from './candles.interface';
import { main, supportedResolutions } from './handler';

describe('candles', () => {
  const mockEvent = {
    httpMethod: 'GET',
    queryStringParameters: {
      symbol: 'any',
      resolution: supportedResolutions[0],
      from: '1569297600',
      to: '1569470400',
    } as CandlesQueryParams,
  };

  const mockData: Candles = {
    c: [217.68, 221.03, 219.89],
    h: [222.49, 221.5, 220.94],
    l: [217.19, 217.1402, 218.83],
    o: [221.03, 218.55, 220],
    s: 'ok',
    t: [1569297600, 1569384000, 1569470400],
    v: [33463820, 24018876, 20730608],
  };

  it('should return a list of candles with statusCode 200', async () => {
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

  it('should return statusCode 400 when an invalid resolution is queried', async () => {
    const get = jest.fn();
    jest.spyOn(axios, 'get').mockImplementation(get);

    const invalidResolution = 'invalid';

    const invalidResolutionEvent = {
      ...mockEvent,
      queryStringParameters: {
        resolution: invalidResolution,
      },
    };

    const response = await main(invalidResolutionEvent, mockContext);

    expect(get).not.toHaveBeenCalled();
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: `Invalid resolution ${invalidResolution}. Valid values are [${supportedResolutions.join(',')}]`,
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
