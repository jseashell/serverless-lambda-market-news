import { formatClientError, formatJsonResponse, formatServerError } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import axios from 'axios';
import { SymbolsQueryParams } from './symbols.interface';

export const supportedExchanges = ['US'];

/**
 * Handler for querying for all stock symbols in a given exchange. Only supports US exchange at this time.
 *
 * @param event a {@link ValidatedEventApiGatewayProxyEvent}
 * @returns Lambda Proxy response. Status 200 for successes and 500 for errors
 */
const candles: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const exchange = event.queryStringParameters.exchange;

  if (!supportedExchanges.includes(exchange)) {
    return formatClientError(`Invalid exchange ${exchange}. Valid values are [${supportedExchanges.join(',')}]`);
  }

  const params: SymbolsQueryParams = {
    token: process.env.FINNHUB_TOKEN,
    exchange: exchange,
  };

  return axios
    .get('https://finnhub.io/api/v1/stock/symbol', {
      params: params,
    })
    .then((res) => {
      return formatJsonResponse({
        data: res.data,
      });
    })
    .catch((error) => {
      console.error(error);
      return formatServerError(JSON.stringify({ message: 'Error', ...error }));
    });
};

export const main = middyfy(candles);
