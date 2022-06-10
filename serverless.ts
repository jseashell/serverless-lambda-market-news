import { candles, userPreferences } from '@functions';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'market-news-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    stage: process.env.STAGE,
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USER_PREFERENCES_TABLE: process.env.USER_PREFERENCES_TABLE,
      FINNHUB_TOKEN: process.env.FINNHUB_TOKEN,
    },
    logs: {
      frameworkLambda: true,
      restApi: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
            Resource: [
              {
                'Fn::GetAtt': ['MarketNewsUserPreferencesTable', 'Arn'],
              },
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { candles, userPreferences },
  package: { individually: true },
  resources: {
    Resources: {
      MarketNewsUserPreferencesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: process.env.USER_PREFERENCES_TABLE,
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
          ],
        },
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
