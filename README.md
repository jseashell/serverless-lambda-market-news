# Market News API

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

> TODO

## Test

```sh
# Run unit tests
npm test

# Run security tests
npm run snyk
```

## Environment

Environment variables are injected into the handler via [serverless.yml](./serverless.yml) config.

## Deploy

This API is configured to deploy to AWS.

### Local

Deployment requires `aws configure` on the deployment workstation

```sh
npx serverless deploy
```

### Remote

CI/CD is serviced by [AppVeyor](https://appveyor.com/). Configuration, such as AWS IAM credentials, is kept in [appveyor.yml](./appveyor.yml). Only the `dev` and `main` branches are deployed.

## License

This software is distributed under the terms of the [MIT License](./LICENSE).
