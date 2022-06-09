# Market News API

[![Build status](https://ci.appveyor.com/api/projects/status/k6ywbw2rwdfqp9q4?svg=true)](https://ci.appveyor.com/project/jseashell/market-news-api)
[![codecov](https://codecov.io/gh/jseashell/market-news-api/branch/dev/graph/badge.svg?token=UKLKODOO55)](https://codecov.io/gh/jseashell/market-news-api)
[![Known Vulnerabilities](https://snyk.io/test/github/jseashell/market-news-api/badge.svg)](https://snyk.io/test/github/jseashell/market-news-api/badge.svg)

Serverless resource API for [Market News](https://github.com/jseashell/market-news-client). Deployed with [AWS Lambda](https://aws.amazon.com/lambda/) and [Serverless Framework](https://serverless.com).

<details>
<summary>Table of Contents</summary>

- [Install](#install)
- [Usage](#usage)
- [Test](#test)
- [Environment](#environment)
- [Deploy](#deploy)
- [License](#license)

</details>

## Install

> Requires Node >=16 (lts/gallium). If you are using [nvm](https://github.com/nvm-sh/nvm), then run `nvm install` from the project directoy

```sh
git clone https://github.com/jseashell/market-news-api.git
cd market-news-api
npm install
```

## Usage

Once [deployed remotely](#remote), you can use the various mocks to execute CRUD operations via API

`npx serverless invoke -f userPreferences -p src/functions/user-preferences/mocks/post.json`

The available mocks are

- [`post.json`](./src/functions/user-preferences/mocks/post.json)
- [`get.json`](./src/functions/user-preferences/mocks/get.json)
- [`patch.json`](./src/functions/user-preferences/mocks/patch.json)
- [`delete.json`](./src/functions/user-preferences/mocks/delete.json)

Alternatively, use `curl` with the `<aws-endpoint>` output from `npx serverless deploy`

```sh
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"userId":"example-id","stocks":[{"symbol":"AAPL"}],"coins":[{"symbol":"BINANCE:BTCUSDT"}]}'
--location <aws-endpoint>
```

## Test

```sh
# Run unit tests, watch available
npm test
npm run test:watch

# Run security tests
npm run snyk
```

## Deploy

### Local

Deployment from a local workstation with Serverless Framework requires `aws configure`. This allows Serverless Framework to use your local AWS credentials to deploy to your account.

```sh
npx serverless deploy
```

Environment variables are kept in ['.env'](./env.example).

### Remote

CI/CD is serviced by [AppVeyor](https://appveyor.com/). Configuration, such as environment variables and AWS CloudFormation configuration, is kept in [appveyor.yml](./appveyor.yml). Only the `dev` and `main` branches are deployed.

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
