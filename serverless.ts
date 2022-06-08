import userPreferences from '@functions/user-preferences';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'market-news-api',
  frameworkVersion: '3',
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
      USER_PREFERENCES_TABLE:
        '${self:resources.Resources.MarketNewsUserPreferencesTable.Properties.TableName}',
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
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
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
  functions: { userPreferences },
  package: { individually: true },
  resources: {
    Resources: {
      MarketNewsUserPreferencesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName:
            'MarketNewsUserPreferences-${opt:stage, self:provider.stage}',
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
