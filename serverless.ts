import userPreferences from '@functions/user-preferences';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-market-news-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:DeleteItem',
              'dynamodb:Scan',
            ],
            Resource: [
              {
                'Fn::GetAtt': ['ServerlessMarketNewsApiUserPreferencesTable', 'Arn'],
              },
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { userPreferences },
  package: { individually: true },
  resources: {
    Resources: {
      ServerlessMarketNewsApiUserPreferencesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'stocks',
              AttributeType: 'SS',
            },
            {
              AttributeName: 'coins',
              AttributeType: 'SS',
            },
          ],
          KeySchema: {
            AttributeName: 'userId',
            KeyType: 'HASH',
          },
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
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
